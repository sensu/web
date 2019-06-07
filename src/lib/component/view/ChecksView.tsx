import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { ApolloError } from "/vendor/apollo-client";

import {
  parseFilterParams,
  buildFilterParams,
  FilterMap,
} from "/lib/util/filterParams";
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
  ChecksListToolbar,
  NotFound,
} from "/lib/component/partial";

const Query = gql`
  query ChecksViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: CheckListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      ...ChecksList_namespace
    }
  }

  ${ChecksList.fragments.namespace}
`;

interface Variables {
  namespace: string;
  limit: number;
  offset: number;
  order: string;
  filters: string[];
}

export function useChecksViewQuery(variables: Variables) {
  return useQuery({
    query: Query,
    fetchPolicy: "cache-and-network",
    pollInterval: pollingDuration.short,
    variables,
    onError: (error: Error): void => {
      if ((error as ApolloError).networkError instanceof FailedError) {
        return;
      }

      throw error;
    },
  });
}

export function useChecksViewQueryVariables() {
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

interface ToolbartContentProps {
  filters: FilterMap;
  setFilters(updater: (filters: FilterMap) => FilterMap): void;
}

export const ChecksViewContent = ({
  toolbarContent,
  toolbarItems,
  query,
  variables,
}: {
  toolbarContent(props: ToolbartContentProps): React.ReactNode;
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}) => {
  const [params, setParams] = useSearchParams();

  const filters = parseFilterParams(params.filters);
  const setFilters = (updater: (filters: FilterMap) => FilterMap): void => {
    const next = updater(filters);
    setParams((params) => ({ ...params, filters: buildFilterParams(next) }));
  };

  const { aborted, data, networkStatus, refetch } = query;
  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

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
            toolbarContent={toolbarContent({
              filters,
              setFilters,
            })}
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
                filters={filters}
                onChangeFilters={setFilters}
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
  const query = useChecksViewQuery(variables);

  return (
    <ChecksViewContent
      query={query}
      variables={variables}
      toolbarContent={({ filters, setFilters }: ToolbartContentProps) => {
        return <FilterList filters={filters} onChange={setFilters} />;
      }}
    />
  );
};

export default ChecksView;
