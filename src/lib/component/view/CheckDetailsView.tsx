import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { PollingDuration } from "/lib/constant";
import { ApolloError } from "/vendor/apollo-client";
import { FailedError } from "/lib/error/FetchError";
import {
  useApolloClient,
  useQuery,
  useRouter,
  UseQueryResult,
} from "/lib/component/util";
import { parseStringParam } from "/lib/util/params";
import {
  AppLayout,
  NotFound,
  CheckDetailsContainer,
} from "/lib/component/partial";

import createSilence from "/lib/mutation/createSilence";
import deleteSilence from "/lib/mutation/deleteSilence";
import executeCheck from "/lib/mutation/executeCheck";
import setPublish from "/lib/mutation/setCheckPublish";

export const checkDetailsViewFragments = {
  record: gql`
    fragment CheckDetailsView_record on CheckConfig {
      id
      deleted @client
      ...CheckDetailsContainer_check
    }

    ${CheckDetailsContainer.fragments.check}
  `,
};

const checkDetailsViewQuery = gql`
  query CheckDetailsContentQuery($namespace: String!, $check: String!) {
    check(namespace: $namespace, name: $check) {
      id
      ...CheckDetailsView_record
    }
  }

  ${checkDetailsViewFragments.record}
`;

interface Variables {
  check: string;
  namespace: string;
}

interface CheckDetailsViewContentProps {
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
  onCreateSilence: (vars: any) => void;
  onDeleteSilence: (vars: any) => void;
  onExecute: (vars: any) => Promise<any>;
  onPublish: (_: any) => Promise<void>;
}

export function useCheckDetailsViewQueryVariables(): Variables {
  const router = useRouter();
  const params = router.match.params as any;

  return {
    namespace: parseStringParam(params.namespace, ""),
    check: parseStringParam(params.check, ""),
  };
}

export const CheckDetailsViewContent = ({
  query,
  variables,
  ...props
}: CheckDetailsViewContentProps) => {
  const { aborted, data = {}, networkStatus, refetch } = query;
  const { check } = data;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!loading && !aborted && (!check || check.deleted)) {
    return (
      <AppLayout namespace={variables.namespace}>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout namespace={variables.namespace}>
      <CheckDetailsContainer
        check={check}
        loading={loading || aborted}
        refetch={refetch}
        {...props}
      />
    </AppLayout>
  );
};

export const CheckDetailsView = () => {
  const client = useApolloClient();
  const onCreateSilence = React.useCallback(
    (vars) => createSilence(client, vars),
    [client],
  );
  const onDeleteSilence = React.useCallback(
    (vars) => deleteSilence(client, vars),
    [client],
  );
  const onExecute = React.useCallback((vars) => executeCheck(client, vars), [
    client,
  ]);
  const onPublish = React.useCallback((vars) => setPublish(client, vars), [
    client,
  ]);

  const variables = useCheckDetailsViewQueryVariables();
  const query = useQuery({
    query: checkDetailsViewQuery,
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

  return (
    <CheckDetailsViewContent
      query={query}
      variables={variables}
      onCreateSilence={onCreateSilence}
      onDeleteSilence={onDeleteSilence}
      onExecute={onExecute}
      onPublish={onPublish}
    />
  );
};
