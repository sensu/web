import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { ApolloError } from "/vendor/apollo-client";

import { PollingDuration } from "/lib/constant";
import { isUnreachable } from "/lib/util/fetchError";

import {
  parseIntParam,
  parseStringParam,
  parseArrayParam,
} from "/lib/util/params";

import {
  useSearchParams,
  SearchParamsMap,
  useQuery,
  useFilterParams,
  UseQueryResult,
  useRouter,
} from "/lib/component/util";
import {
  MobileFullWidthContent,
  Content,
  FilterList,
} from "/lib/component/base";
import {
  AppLayout,
  EventFiltersList,
  eventFiltersListFragments,
  EventFiltersListToolbar,
  NotFound,
} from "/lib/component/partial";
import { EventFiltersListVariables } from "/lib/component/partial/EventFiltersList/EventFiltersList";

interface Variables extends EventFiltersListVariables {
  namespace: string;
}

export const eventFiltersViewFragments = {
  namespace: gql`
    fragment eventFiltersView_namespace on Namespace {
      id
      ...EventFiltersList_namespace
    }

    ${eventFiltersListFragments.namespace}
  `,
};

const EventFiltersViewQuery = gql`
  query EventFiltersViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: EventFilterListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      id
      ...eventFiltersView_namespace
    }
  }

  ${eventFiltersViewFragments.namespace}
`;

export function useEventFiltersViewQueryVariables(): Variables {
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

interface EventFiltersViewContentProps {
  toolbarContent: React.ReactNode;
  toolbarItems?: () => React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export const EventFiltersViewContent = ({
  toolbarContent,
  toolbarItems,
  query,
  variables,
}: EventFiltersViewContentProps) => {
  const { aborted, data = {}, networkStatus } = query;
  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  const [, setParams] = useSearchParams();

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
          <EventFiltersListToolbar
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
          <EventFiltersList
            editable={false}
            loading={(loading && !data.namespace) || aborted}
            limit={variables.limit}
            namespace={(data || {}).namespace}
            offset={variables.offset}
            order={variables.order}
          />
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

const BoundFilterList = () => {
  const [filters, setFilters] = useFilterParams();
  return <FilterList filters={filters} onChange={setFilters} />;
};

EventFiltersViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const EventFiltersView = () => {
  const variables = useEventFiltersViewQueryVariables();

  const query = useQuery({
    query: EventFiltersViewQuery,
    variables,
    fetchPolicy: "cache-and-network",
    pollInterval: PollingDuration.short,
    onError: (error: Error): void => {
      if (isUnreachable((error as ApolloError).networkError)) {
        return;
      }

      throw error;
    },
  });

  return <EventFiltersViewContent query={query} variables={variables} />;
};
