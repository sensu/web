import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { ApolloError } from "/vendor/apollo-client";

import { pollingDuration } from "/lib/constant/polling";
import { FailedError } from "/lib/error/FetchError";

import {
  parseIntParam,
  parseStringParam,
  parseArrayParam,
} from "/lib/util/params";

import {
  useSearchParams,
  useQuery,
  useFilterParams,
  UseQueryResult,
  WithWidth,
  useRouter,
} from "/lib/component/util";
import {
  MobileFullWidthContent,
  Content,
  FilterList,
} from "/lib/component/base";
import {
  AppLayout,
  ChecksList,
  checksListFragments,
  ChecksListToolbar,
  NotFound,
} from "/lib/component/partial";
import { ChecksListVariables } from "/lib/component/partial/ChecksList/ChecksList";

interface Variables extends ChecksListVariables {
  namespace: string;
}

export const checksViewFramgents = {
  namespace: gql`
    fragment ChecksView_namespace on Namespace {
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
      ...ChecksView_namespace
    }
  }

  ${checksViewFramgents.namespace}
`;

export function useChecksViewQueryVariables(): Variables {
  const [params] = useSearchParams();
  const limit = parseIntParam(params.limit, 25);
  const offset = parseIntParam(params.offset, 0);
  const order = parseStringParam(params.order, "NAME");
  const filters = parseArrayParam(params.order);

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
  const { aborted, data, networkStatus, refetch } = query;
  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  const [, setParams] = useSearchParams();

  if (!(data || {}).namespace && !loading && !aborted) {
    return <NotFound />;
  }

  return (
    <AppLayout namespace={variables.namespace}>
      <div>
        <Content marginBottom>
          <ChecksListToolbar
            onClickReset={() => {
              setParams((params) => ({
                ...params,
                fiters: undefined,
                order: undefined,
              }));
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
                loading={(loading && !variables.namespace) || aborted}
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

const ChecksView = () => {
  const variables = useChecksViewQueryVariables();

  const query = useQuery({
    query: ChecksViewQuery,
    variables,
    fetchPolicy: "cache-and-network",
    pollInterval: pollingDuration.short,
    onError: (error: Error): void => {
      if ((error as ApolloError).networkError instanceof FailedError) {
        return;
      }

      throw error;
    },
  });

  const [filters, setFilters] = useFilterParams();

  return (
    <ChecksViewContent
      query={query}
      variables={variables}
      toolbarContent={<FilterList filters={filters} onChange={setFilters} />}
    />
  );
};

export default ChecksView;
