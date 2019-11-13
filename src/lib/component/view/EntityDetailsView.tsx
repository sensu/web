import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { PollingDuration } from "../../constant";
import { ApolloError } from "/vendor/apollo-client";
import { FailedError } from "/lib/error/FetchError";
import {
  useQuery,
  useRouter,
  UseQueryResult,
} from "/lib/component/util";
import { parseStringParam } from "/lib/util/params";
import {
  AppLayout,
  EntityDetailsContainer,
  NotFound,
} from "/lib/component/partial";

export const entityDetailsViewFragments = {
  record: gql`
    fragment EntityDetailsView_record on Entity {
      id
      deleted @client
      ...EntityDetailsContainer_entity
    }

    ${EntityDetailsContainer.fragments.entity}
  `,
};

const entityDetailsViewQuery = gql`
  query EntityDetailsContentQuery($namespace: String!, $entity: String!) {
    entity(namespace: $namespace, name: $entity) {
      id
      ...EntityDetailsView_record
    }
  }

  ${entityDetailsViewFragments.record}
`;

interface Variables {
  entity: string;
  namespace: string;
}

interface EntityDetailsViewContentProps {
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export function useEntityDetailsViewQueryVariables(): Variables {
  const router = useRouter();
  const params = router.match.params as any;

  return {
    namespace: parseStringParam(params.namespace, ""),
    entity: parseStringParam(params.entity, ""),
  };
}

export const EntityDetailsViewContent = ({
  query,
  toolbarItems,
  variables,
}: EntityDetailsViewContentProps) => {
  const { aborted, data = {}, networkStatus, refetch } = query;
  const { entity } = data;
  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!loading && !aborted && (!entity || entity.deleted)) {
    return (
      <AppLayout namespace={variables.namespace}>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout namespace={variables.namespace}>
      {variables.entity && (
        <EntityDetailsContainer
          toolbarItems={toolbarItems}
          entity={variables.entity}
          refetch={refetch}
        />
      )}
    </AppLayout>
  );
};

export const EntityDetailsView = () => {
  const variables = useEntityDetailsViewQueryVariables();
  const query = useQuery({
    query: entityDetailsViewQuery,
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

  return <EntityDetailsViewContent query={query} variables={variables} />;
};
