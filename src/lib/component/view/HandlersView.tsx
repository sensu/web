import React, { useCallback } from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { isUnreachable } from "/lib/util/fetchError";
import { ApolloError } from "/vendor/apollo-client";
import { PollingDuration } from "/lib/constant";

import {
  parseIntParam,
  parseStringParam,
  parseArrayParam,
} from "/lib/util/params";

import { Content, MobileFullWidthContent } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  HandlersList,
  HandlersListToolbar,
  NotFound,
} from "/lib/component/partial";
import {
  useBreakpoint,
  useFilterParams,
  useSearchParams,
  useQuery,
  useRouter,
  UseQueryResult,
} from "/lib/component/util";

interface Variables {
  namespace: string;
  filters: string[];
  order: string;
  limit: number;
  offset: number;
}

interface Props {
  toolbarContent?: React.ReactNode;
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export const useHandlersViewQueryVariables = (): Variables => {
  const [params] = useSearchParams();
  const limit = parseIntParam(params.limit, 25);
  const offset = parseIntParam(params.offset, 0);
  const order = parseStringParam(params.order, "NAME");
  const filters = parseArrayParam(params.filters);

  const router = useRouter();
  const namespace = parseStringParam(
    (router.match.params as any).namespace,
    "",
  );

  return {
    namespace,
    limit,
    offset,
    order,
    filters,
  };
};

export const handlersViewFragments = {
  namespace: gql`
    fragment HandlersView_namespace on Namespace {
      id
      ...HandlersList_namespace
    }

    ${HandlersList.fragments.namespace}
  `,
};

const handlersViewQuery = gql`
  query HandlersViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: HandlerListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      id
      ...HandlersView_namespace
    }
  }

  ${handlersViewFragments.namespace}
`;

export const HandlersViewContent = ({
  query,
  toolbarContent,
  toolbarItems,
  variables,
}: Props) => {
  const [, setFilters] = useFilterParams();
  const [, setParams] = useSearchParams();
  const isSmViewport = !useBreakpoint("sm", "gt");

  const { aborted, data = {}, networkStatus } = query;
  const { namespace } = data;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  const onClickReset = useCallback(
    () =>
      setParams((params) => ({
        ...params,
        filters: undefined,
        order: undefined,
      })),
    [setParams],
  );

  if (!data.namespace && !loading && !aborted) {
    return (
      <AppLayout>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        <Content marginBottom>
          <HandlersListToolbar
            onClickReset={onClickReset}
            toolbarContent={toolbarContent}
            toolbarItems={toolbarItems}
          />
        </Content>

        <MobileFullWidthContent>
          <HandlersList
            editable={!isSmViewport}
            limit={variables.limit}
            offset={variables.offset}
            onChangeQuery={setParams}
            onChangeFilters={setFilters}
            namespace={namespace}
            loading={(loading && !namespace) || aborted}
            order={variables.order}
          />
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

HandlersViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const HandlersView = () => {
  const variables = useHandlersViewQueryVariables();
  const query = useQuery({
    query: handlersViewQuery,
    fetchPolicy: "cache-and-network",
    pollInterval: PollingDuration.short,
    variables,
    onError: (error: Error) => {
      if (isUnreachable((error as ApolloError).networkError)) {
        return;
      }

      throw error;
    },
  });
  return <HandlersViewContent query={query} variables={variables} />;
};
