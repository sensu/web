import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { PollingDuration } from "../../constant";
import { ApolloError } from "/vendor/apollo-client";
import { isUnreachable } from "/lib/util/fetchError";
import {
  useApolloClient,
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

import createSilence from "/lib/mutation/createSilence";
import deleteSilence from "/lib/mutation/deleteSilence";
import deleteEntity from "/lib/mutation/deleteEntity";

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
  onCreateSilence: (_: any) => void;
  onDeleteSilence: (_: any) => void;
  onDelete: (_: any) => Promise<any>;
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
  variables,
  ...props
}: EntityDetailsViewContentProps) => {
  const { aborted, data = {}, networkStatus, refetch } = query;
  const { entity } = data;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;
  if (!loading && !aborted && (!entity || entity.deleted)) {
    return (
      <AppLayout>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <EntityDetailsContainer
        entity={entity}
        refetch={refetch}
        loading={loading}
        {...props}
      />
    </AppLayout>
  );
};

export const EntityDetailsView = () => {
  const client = useApolloClient();
  const onCreateSilence = React.useCallback(
    (vars) => createSilence(client, vars),
    [client],
  );
  const onDeleteSilence = React.useCallback(
    (vars) => deleteSilence(client, vars),
    [client],
  );
  const onDelete = React.useCallback((vars) => deleteEntity(client, vars), [
    client,
  ]);

  const variables = useEntityDetailsViewQueryVariables();
  const query = useQuery({
    query: entityDetailsViewQuery,
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
    <EntityDetailsViewContent
      query={query}
      variables={variables}
      onCreateSilence={onCreateSilence}
      onDeleteSilence={onDeleteSilence}
      onDelete={onDelete}
    />
  );
};
