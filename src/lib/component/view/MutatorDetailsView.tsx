import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { ApolloError } from "/vendor/apollo-client";
import { PollingDuration } from "../../constant";
import { isUnreachable } from "/lib/util/fetchError";
import { useQuery, useRouter, UseQueryResult } from "/lib/component/util";

import {
  AppLayout,
  NotFound,
  MutatorDetailsContainer,
  mutatorDetailsContainerFragments,
} from "/lib/component/partial";

interface Variables {
  namespace: string;
  name: string;
}

export const mutatorDetailsViewFragments = {
  mutator: gql`
    fragment MutatorDetailsView_mutator on Mutator {
      id
      deleted @client
      ...MutatorDetailsContainer_mutator
    }

    ${mutatorDetailsContainerFragments.mutator}
  `,
};

const mutatorDetailsViewQuery = gql`
  query MutatorDetailsContentQuery($namespace: String!, $name: String!) {
    mutator(namespace: $namespace, name: $name) {
      ...MutatorDetailsView_mutator
    }
  }
  ${mutatorDetailsViewFragments.mutator}
`;

export function useMutatorDetailsViewQueryVariables(): Variables {
  const router = useRouter();
  const namespace = (router.match.params as any).namespace || "";
  const name = (router.match.params as any).mutator || "";

  return {
    namespace,
    name,
  };
}

interface MutatorDetailsViewContentProps {
  toolbarItems?: (items: any[]) => React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export const MutatorDetailsViewContent = ({
  toolbarItems,
  query,
}: MutatorDetailsViewContentProps) => {
  const { aborted, data = {}, networkStatus } = query;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!loading && !aborted && (!data.mutator || data.mutator.deleted)) {
    return (
      <AppLayout>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <MutatorDetailsContainer
        toolbarItems={toolbarItems}
        mutator={data.mutator}
        loading={loading || aborted}
      />
    </AppLayout>
  );
};

export const MutatorDetailsView = () => {
  const variables = useMutatorDetailsViewQueryVariables();
  const query = useQuery({
    query: mutatorDetailsViewQuery,
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

  return <MutatorDetailsViewContent query={query} variables={variables} />;
};
