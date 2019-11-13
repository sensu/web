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

export const checkDetailsViewFragments = {
  record: gql`
    fragment CheckDetailsView_record on CheckConfig {
      id
      ...CheckDetailsContainer_check
    }

    ${CheckDetailsContainer.fragments.check}
  `,
};

const checkDetailsViewQuery = gql`
  query CheckDetailsContentQuery($namespace: String!, $check: String!) {
    check(namespace: $namespace, name: $check) {
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
  toolbarItems,
  variables,
}: CheckDetailsViewContentProps) => {
  const client = useApolloClient();
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
        toolbarItems={toolbarItems}
        client={client}
        check={check}
        loading={loading || aborted}
        refetch={refetch}
      />
    </AppLayout>
  );
};

export const CheckDetailsView = () => {
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

  return <CheckDetailsViewContent query={query} variables={variables} />;
};
