import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { ApolloError } from "/vendor/apollo-client";
import { PollingDuration } from "../../constant";
import { isUnreachable } from "/lib/util/fetchError";
import { useQuery, useRouter, UseQueryResult } from "/lib/component/util";

import {
  AppLayout,
  NotFound,
  EventFilterDetailsContainer,
  eventFilterDetailsContainerFragments,
} from "/lib/component/partial";

interface Variables {
  namespace: string;
  name: string;
}

export const eventFilterDetailsViewFragments = {
  eventFilter: gql`
    fragment EventFilterDetailsView_eventFilter on EventFilter {
      id
      ...EventFilterDetailsContainer_eventFilter
    }

    ${eventFilterDetailsContainerFragments.eventFilter}
  `,
};

const eventFilterDetailsViewQuery = gql`
  query EventFilterDetailsContentQuery($namespace: String!, $name: String!) {
    eventFilter(namespace: $namespace, name: $name) {
      ...EventFilterDetailsView_eventFilter
    }
  }
  ${eventFilterDetailsViewFragments.eventFilter}
`;

export function useEventFilterDetailsViewQueryVariables(): Variables {
  const router = useRouter();
  const namespace = (router.match.params as any).namespace || "";
  const name = (router.match.params as any).filter || "";

  return {
    namespace,
    name,
  };
}

interface EventFilterDetailsViewContentProps {
  toolbarItems?: (items: any[]) => React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export const EventFilterDetailsViewContent = ({
  toolbarItems,
  query,
  variables,
}: EventFilterDetailsViewContentProps) => {
  const { aborted, data = {}, networkStatus } = query;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!loading && !aborted && (!data.eventFilter || data.eventFilter.deleted)) {
    return (
      <AppLayout namespace={variables.namespace}>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout namespace={variables.namespace}>
      <EventFilterDetailsContainer
        toolbarItems={toolbarItems}
        eventFilter={data.eventFilter}
        loading={loading || aborted}
      />
    </AppLayout>
  );
};

export const EventFilterDetailsView = () => {
  const variables = useEventFilterDetailsViewQueryVariables();
  const query = useQuery({
    query: eventFilterDetailsViewQuery,
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

  return <EventFilterDetailsViewContent query={query} variables={variables} />;
};
