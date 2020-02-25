import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { PollingDuration } from "../../constant";
import { ApolloError } from "/vendor/apollo-client";
import { isUnreachable } from "/lib/util/fetchError";
import { useQuery, useRouter, UseQueryResult } from "/lib/component/util";
import { parseStringParam } from "/lib/util/params";
import {
  AppLayout,
  NotFound,
  HandlerDetailsContainer,
} from "/lib/component/partial";

export const handlerDetailsViewFragments = {
  record: gql`
    fragment HandlerDetailsView_record on Handler {
      id
      deleted @client
      ...HandlerDetailsContainer_handler
    }

    ${HandlerDetailsContainer.fragments.handler}
  `,
};

const handlerDetailsViewQuery = gql`
  query HandlerDetailsContentQuery($namespace: String!, $handler: String!) {
    handler(namespace: $namespace, name: $handler) {
      id
      ...HandlerDetailsView_record
    }
  }

  ${handlerDetailsViewFragments.record}
`;

interface Variables {
  handler: string;
  namespace: string;
}

interface HandlerDetailsViewContentProps {
  toolbarItems?: (items: any[]) => React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
}

export function useHandlerDetailsViewQueryVariables(): Variables {
  const router = useRouter();
  const params = router.match.params as any;

  return {
    namespace: parseStringParam(params.namespace, ""),
    handler: parseStringParam(params.handler, ""),
  };
}

export const HandlerDetailsViewContent = ({
  query,
  toolbarItems,
}: HandlerDetailsViewContentProps) => {
  const { aborted, data = {}, networkStatus } = query;
  const { handler } = data;
  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!loading && !aborted && (!handler || handler.deleted)) {
    return (
      <AppLayout>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <HandlerDetailsContainer
        toolbarItems={toolbarItems}
        handler={handler}
        loading={loading || aborted}
      />
    </AppLayout>
  );
};

export const HandlerDetailsView = () => {
  const variables = useHandlerDetailsViewQueryVariables();
  const query = useQuery({
    query: handlerDetailsViewQuery,
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

  return <HandlerDetailsViewContent query={query} variables={variables} />;
};
