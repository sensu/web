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
  useApolloClient,
  useFilterParams,
  useSearchParams,
  useQuery,
  useRouter,
  UseQueryResult,
  WithWidth,
} from "/lib/component/util";
import { MobileFullWidthContent, Content } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  EventsList,
  EventsListToolbar,
  NotFound,
} from "/lib/component/partial";

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

export const useEventsViewQueryVariables = (): Variables => {
  const [params] = useSearchParams();
  const limit = parseIntParam(params.limit, 25);
  const offset = parseIntParam(params.offset, 0);
  const order = parseStringParam(params.order, "LASTOK");
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

export const eventsViewFragments = {
  namespace: gql`
    fragment EventsView_namespace on Namespace {
      id
      ...EventsList_namespace
    }

    ${EventsList.fragments.namespace}
  `,
};

const eventsViewQuery = gql`
  query EventsViewQuery(
    $namespace: String!
    $filters: [String!]
    $order: EventsListOrder
    $limit: Int
    $offset: Int
  ) {
    namespace(name: $namespace) {
      id
      ...EventsView_namespace
    }
  }

  ${eventsViewFragments.namespace}
`;

export const EventsViewContent = ({
  query,
  toolbarContent,
  toolbarItems,
  variables,
}: Props) => {
  const client = useApolloClient();
  const [, setQueryParams] = useSearchParams();
  const [, setFilters] = useFilterParams();

  const { data = {}, networkStatus, aborted, refetch } = query;
  const { namespace } = data;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!data.namespace && !loading && !aborted) {
    return (
      <AppLayout namespace={variables.namespace}>
        <NotFound />
      </AppLayout>
    );
  }

  const onClickReset = useCallback(
    () =>
      setQueryParams((params) => ({
        ...params,
        filters: undefined,
        order: undefined,
      })),
    [setQueryParams],
  );

  // const { queryParams, match, setQueryParams } = this.props;
  // const { limit, offset } = queryParams;
  // const variables = { ...match.params, ...queryParams };

  // const filters = parseFilterParams(queryParams.filters);
  // const setFilters = (setter) => {
  //   const next = setter(filters);
  //   setQueryParams({ filters: buildFilterParams(next) });
  // };

  return (
    <AppLayout namespace={variables.namespace}>
      <div>
        <Content marginBottom>
          <EventsListToolbar
            onClickReset={onClickReset}
            toolbarContent={toolbarContent}
            toolbarItems={toolbarItems}
          />
        </Content>
        <MobileFullWidthContent>
          <WithWidth>
            {({ width }) => (
              <EventsList
                client={client}
                editable={width !== "xs"}
                limit={variables.limit}
                offset={variables.offset}
                filters={variables.filters}
                onChangeQuery={setQueryParams}
                onChangeFilters={setFilters}
                namespace={namespace}
                loading={(loading && !namespace) || aborted}
                refetch={refetch}
              />
            )}
          </WithWidth>
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

EventsViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const EventsView = () => {
  const variables = useEventsViewQueryVariables();
  const query = useQuery({
    query: eventsViewQuery,
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

  return <EventsViewContent query={query} variables={variables} />;
};

export default EventsView;
