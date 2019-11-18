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
  useBreakpoint,
  useFilterParams,
  useSearchParams,
  useQuery,
  useRouter,
  UseQueryResult,
} from "/lib/component/util";
import { MobileFullWidthContent, Content } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  EventsList,
  EventsListToolbar,
  NotFound,
} from "/lib/component/partial";

import createSilence from "/lib/mutation/createSilence";
import deleteSilence from "/lib/mutation/deleteSilence";
import resolveEvent from "/lib/mutation/resolveEvent";
import executeCheck from "/lib/mutation/executeCheck";
import deleteEvent from "/lib/mutation/deleteEvent";

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
  onCreateSilence: (_: any) => void;
  onDeleteSilence: (_: any) => void;
  onResolve: (_: any) => Promise<any>;
  onExecute: (_: any) => Promise<any>;
  onDelete: (_: any) => Promise<any>;
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
  ...props
}: Props) => {
  const client = useApolloClient();
  const [, setFilters] = useFilterParams();
  const [, setParams] = useSearchParams();
  const isSmViewport = !useBreakpoint("sm", "gt");

  const { data = {}, networkStatus, aborted, refetch } = query;
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
      <AppLayout namespace={variables.namespace}>
        <NotFound />
      </AppLayout>
    );
  }

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
          <EventsList
            client={client}
            editable={!isSmViewport}
            limit={variables.limit}
            offset={variables.offset}
            filters={variables.filters}
            onChangeQuery={setParams}
            onChangeFilters={setFilters}
            namespace={namespace}
            loading={(loading && !namespace) || aborted}
            refetch={refetch}
            {...props}
          />
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

EventsViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const EventsView = () => {
  const client = useApolloClient();
  const onCreateSilence = React.useCallback(
    (vars) => createSilence(client, vars),
    [client],
  );
  const onDeleteSilence = React.useCallback(
    (vars) => deleteSilence(client, vars),
    [client],
  );
  const onResolve = React.useCallback((vars) => resolveEvent(client, vars), [
    client,
  ]);
  const onExecute = React.useCallback((vars) => executeCheck(client, vars), [
    client,
  ]);
  const onDelete = React.useCallback((vars) => deleteEvent(client, vars), [
    client,
  ]);

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

  return (
    <EventsViewContent
      query={query}
      variables={variables}
      onCreateSilence={onCreateSilence}
      onDeleteSilence={onDeleteSilence}
      onResolve={onResolve}
      onExecute={onExecute}
      onDelete={onDelete}
    />
  );
};
