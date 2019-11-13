import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { FailedError } from "/lib/error/FetchError";
import { ApolloError } from "/vendor/apollo-client";
import { useQuery, useRouter, UseQueryResult } from "/lib/component/util";
import {
  AppLayout,
  NotFound,
  EventDetailsContainer,
} from "/lib/component/partial";
import { parseStringParam } from "/lib/util/params";
import { PollingDuration } from "../../constant";

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

  ${EventDetailsContainer.fragments.event}
`;

interface Variables {
  event: string;
  namespace: string;
  entity: string;
}

interface EventDetailsViewContentProps {
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export function useEventDetailsViewQueryVariables(): Variables {
  const router = useRouter();
  const params = router.match.params as any;

  return {
    namespace: parseStringParam(params.namespace, ""),
    event: parseStringParam(params.event, ""),
    entity: parseStringParam(params.entity, ""),
  };
}

export const EventDetailsViewContent = ({
  query,
  toolbarItems,
  variables,
}: EventDetailsViewContentProps) => {
  const { aborted, data = {}, networkStatus, refetch } = query;
  const { event } = data;
  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!loading && !aborted && (!event || event.deleted)) {
    return (
      <AppLayout namespace={variables.namespace}>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout namespace={variables.namespace}>
      <EventDetailsContainer
        toolbarItems={toolbarItems}
        event={event}
        loading={loading || !!aborted}
        refetch={refetch}
      />
    </AppLayout>
  );
};

export const EventDetailsView = () => {
  const variables = useEventDetailsViewQueryVariables();
  const query = useQuery({
    query: eventDetailsViewQuery,
    pollInterval: PollingDuration.short,
    fetchPolicy: "cache-and-network",
    variables,
    onError: (error: Error): void => {
      if ((error as ApolloError).networkError instanceof FailedError) {
        return;
      }

      throw error;
    },
  });

  return <EventDetailsViewContent query={query} variables={variables} />;
};
