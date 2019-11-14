import React, { useCallback } from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { ApolloError } from "/vendor/apollo-client";
import { FailedError } from "/lib/error/FetchError";
import { PollingDuration } from "/lib/constant";

import {
  parseIntParam,
  parseStringParam,
  parseArrayParam,
} from "/lib/util/params";
import {
  useFilterParams,
  useSearchParams,
  useQuery,
  useRouter,
  UseQueryResult,
  WithWidth,
} from "/lib/component/util";
import { Content, MobileFullWidthContent } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  MutatorsList,
  MutatorsListToolbar,
  NotFound,
} from "/lib/component/partial";

interface Props {
  toolbarContent?: React.ReactNode;
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

interface Variables {
  namespace: string;
  limit: number;
  offset: number;
  order: string;
  filters: string[];
}

export const useMutatorsViewQueryVariables = (): Variables => {
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

export const mutatorsViewFragments = {
  namespace: gql`
    fragment MutatorsView_namespace on Namespace {
      id
      ...MutatorsList_namespace
    }

    ${MutatorsList.fragments.namespace}
  `,
};

const mutatorsViewQuery = gql`
  query MutatorsViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: MutatorListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      ...MutatorsView_namespace
    }
  }

  ${mutatorsViewFragments.namespace}
`;

export const MutatorsViewContent = ({
  query,
  toolbarContent,
  toolbarItems,
  variables,
}: Props) => {
  const [, setQueryParams] = useSearchParams();
  const [, setFilters] = useFilterParams();

  const { aborted, data = {}, networkStatus } = query;
  const { namespace } = data;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  const onClickReset = useCallback(
    () =>
      setQueryParams((params) => ({
        ...params,
        filters: undefined,
        order: undefined,
      })),
    [setQueryParams],
  );

  if (!data.namespace && !loading && !aborted) {
    return (
      <AppLayout namespace={variables.namespace}>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout namespace={variables.namespace}>
      <div>
        <Content marginBottom>
          <MutatorsListToolbar
            onClickReset={onClickReset}
            toolbarContent={toolbarContent}
            toolbarItems={toolbarItems}
          />
        </Content>

        <MobileFullWidthContent>
          <WithWidth>
            {({ width }) => (
              <MutatorsList
                editable={width !== "xs"}
                limit={variables.limit}
                filters={variables.filters}
                offset={variables.offset}
                onChangeFilters={setFilters}
                onChangeQuery={setQueryParams}
                namespace={namespace}
                loading={(loading && !namespace) || aborted}
                order={variables.order}
              />
            )}
          </WithWidth>
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

MutatorsViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const MutatorsView = () => {
  const variables = useMutatorsViewQueryVariables();
  const query = useQuery({
    query: mutatorsViewQuery,
    fetchPolicy: "cache-and-network",
    pollInterval: PollingDuration.short,
    variables,
    onError: (error: Error) => {
      if ((error as ApolloError).networkError instanceof FailedError) {
        return;
      }

      throw error;
    },
  });

  return <MutatorsViewContent query={query} variables={variables} />;
};
