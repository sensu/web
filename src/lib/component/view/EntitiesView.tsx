import * as React from "/vendor/react";
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
  useApolloClient,
  useFilterParams,
  useSearchParams,
  useQuery,
  UseQueryResult,
  useRouter,
  WithWidth,
} from "/lib/component/util";
import { MobileFullWidthContent, Content } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  EntitiesList,
  EntitiesListToolbar,
  NotFound,
} from "/lib/component/partial";

const entitiesViewQuery = gql`
  query EnvironmentViewEntitiesViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: EntityListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      ...EntitiesList_namespace
    }
  }

  ${EntitiesList.fragments.namespace}
`;

interface Variables {
  namespace: string;
  limit: number;
  offset: number;
  order: string;
  filters: string[];
}

export const useEntitiesViewQueryVariables = (): Variables => {
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

interface EntitiesViewContentProps {
  toolbarContent?: React.ReactNode;
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export const EntitiesViewContent = ({
  query,
  toolbarContent,
  toolbarItems,
  variables,
}: EntitiesViewContentProps) => {
  const client = useApolloClient();
  // const { queryParams, match, setQueryParams } = this.props;
  // const { limit, offset, order } = queryParams;
  // const variables = { ...match.params, ...queryParams };

  // const filters = parseFilterParams(queryParams.filters);
  // const setFilters = setter => {
  //   const next = setter(filters);
  //   setQueryParams({ filters: buildFilterParams(next) });
  // };
  const { data = {}, networkStatus, aborted, refetch } = query;
  const [, setQueryParams] = useSearchParams();
  const [, setFilters] = useFilterParams();

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

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
          <EntitiesListToolbar
            onClickReset={() =>
              setQueryParams((params) => ({
                ...params,
                filters: undefined,
                order: undefined,
              }))
            }
            toolbarContent={toolbarContent}
            toolbarItems={toolbarItems}
          />
        </Content>

        <MobileFullWidthContent>
          <WithWidth>
            {({ width }) => (
              <EntitiesList
                client={client}
                editable={width !== "xs"}
                limit={variables.limit}
                offset={variables.offset}
                loading={(loading && !data.namespace) || aborted}
                filters={variables.filters}
                onChangeFilters={setFilters}
                onChangeQuery={setQueryParams}
                namespace={data.namespace}
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

EntitiesViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const EntitiesView = () => {
  const variables = useEntitiesViewQueryVariables();
  const query = useQuery({
    query: entitiesViewQuery,
    fetchPolicy: "cache-and-network",
    pollInterval: PollingDuration.short,
    variables,
    onError: (error: Error): void => {
      if ((error as ApolloError).networkError instanceof FailedError) {
        return;
      }

      throw error;
    },
  });

  return <EntitiesViewContent query={query} variables={variables} />;
};
