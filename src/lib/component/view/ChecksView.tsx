import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { ApolloError } from "/vendor/apollo-client";

import { PollingDuration } from "../../constant";
import { FailedError } from "/lib/error/FetchError";

import {
  parseIntParam,
  parseStringParam,
  parseArrayParam,
} from "/lib/util/params";

import {
  useSearchParams,
  SearchParamsMap,
  useQuery,
  UseQueryResult,
  WithWidth,
  useRouter,
} from "/lib/component/util";
import { MobileFullWidthContent, Content } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  ChecksList,
  checksListFragments,
  ChecksListToolbar,
  NotFound,
} from "/lib/component/partial";
import { ChecksListVariables } from "/lib/component/partial/ChecksList/ChecksList";

interface Variables extends ChecksListVariables {
  namespace: string;
}

export const checksViewFragments = {
  namespace: gql`
    fragment ChecksView_namespace on Namespace {
      id
      ...ChecksList_namespace
    }

    ${checksListFragments.namespace}
  `,
};

export const ChecksViewQuery = gql`
  query ChecksViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: CheckListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      id
      ...ChecksView_namespace
    }
  }

  ${checksViewFragments.namespace}
`;

export function useChecksViewQueryVariables(): Variables {
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
}

interface ChecksViewContentProps {
  toolbarContent?: React.ReactNode;
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export const ChecksViewContent = ({
  toolbarContent,
  toolbarItems,
  query,
  variables,
}: ChecksViewContentProps) => {
  const { aborted, data = {}, networkStatus, refetch } = query;
  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  const [, setParams] = useSearchParams();

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
          <ChecksListToolbar
            onClickReset={() => {
              setParams(
                (params): SearchParamsMap => ({
                  ...params,
                  filters: undefined,
                  order: undefined,
                }),
              );
            }}
            toolbarContent={toolbarContent}
            toolbarItems={toolbarItems}
          />
        </Content>
        <MobileFullWidthContent>
          <WithWidth>
            {({ width }) => (
              <ChecksList
                editable={width !== "xs"}
                limit={variables.limit}
                offset={variables.offset}
                namespace={(data || {}).namespace}
                loading={(loading && !data.namespace) || aborted}
                refetch={refetch}
                order={variables.order}
              />
            )}
          </WithWidth>
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

ChecksViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const ChecksView = () => {
  const variables = useChecksViewQueryVariables();

  const query = useQuery({
    query: ChecksViewQuery,
    variables,
    fetchPolicy: "cache-and-network",
    pollInterval: PollingDuration.short,
    onError: (error: Error): void => {
      if ((error as ApolloError).networkError instanceof FailedError) {
        return;
      }

      throw error;
    },
  });

  return <ChecksViewContent query={query} variables={variables} />;
};
