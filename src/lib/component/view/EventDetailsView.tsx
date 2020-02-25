import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { isUnreachable } from "/lib/util/fetchError";
import { ApolloError } from "/vendor/apollo-client";
import {
  useApolloClient,
  useQuery,
  UseQueryResult,
  useRouter,
} from "/lib/component/util";
import {
  AppLayout,
  NotFound,
  EventDetailsContainer,
} from "/lib/component/partial";
import { parseStringParam } from "/lib/util/params";
import { PollingDuration } from "../../constant";

import createSilence from "/lib/mutation/createSilence";
import deleteSilence from "/lib/mutation/deleteSilence";
import resolveEvent from "/lib/mutation/resolveEvent";
import executeCheck from "/lib/mutation/executeCheck";
import deleteEvent from "/lib/mutation/deleteEvent";

export const eventDetailsViewFragments = {
  record: gql`
    fragment EventDetailsView_record on Event {
      id
      deleted @client
      ...EventDetailsContainer_event
    }

    ${EventDetailsContainer.fragments.event}
  `,
};

const eventDetailsViewQuery = gql`
  query EventDetailsContentQuery(
    $namespace: String!
    $check: String!
    $entity: String!
  ) {
    event(namespace: $namespace, entity: $entity, check: $check) {
      id
      ...EventDetailsView_record
    }
  }

  ${eventDetailsViewFragments.record}
`;

interface Variables {
  check: string;
  namespace: string;
  entity: string;
}

interface EventDetailsViewContentProps {
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
  onCreateSilence: (_: any) => void;
  onDeleteSilence: (_: any) => void;
  onResolve: (_: any) => Promise<any>;
  onExecute: (_: any) => Promise<any>;
  onDelete: (_: any) => Promise<any>;
}

export function useEventDetailsViewQueryVariables(): Variables {
  const router = useRouter();
  const params = router.match.params as any;

  return {
    namespace: parseStringParam(params.namespace, ""),
    check: parseStringParam(params.check, ""),
    entity: parseStringParam(params.entity, ""),
  };
}

export const EventDetailsViewContent = ({
  query,
  variables,
  ...props
}: EventDetailsViewContentProps) => {
  const { aborted, data = {}, networkStatus, refetch } = query;
  const { event } = data;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!loading && !aborted && (!event || event.deleted)) {
    return (
      <AppLayout>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <EventDetailsContainer
        event={event}
        loading={loading || !!aborted}
        refetch={refetch}
        {...props}
      />
    </AppLayout>
  );
};

export const EventDetailsView = () => {
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

  const variables = useEventDetailsViewQueryVariables();
  const query = useQuery({
    query: eventDetailsViewQuery,
    pollInterval: PollingDuration.short,
    fetchPolicy: "cache-and-network",
    variables,
    onError: (error: Error): void => {
      if (isUnreachable((error as ApolloError).networkError)) {
        return;
      }

      throw error;
    },
  });

  return (
    <EventDetailsViewContent
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
