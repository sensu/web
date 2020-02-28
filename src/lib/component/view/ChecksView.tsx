import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";
import { ApolloError } from "/vendor/apollo-client";

import { PollingDuration } from "../../constant";
import { isUnreachable } from "/lib/util/fetchError";

import {
  parseIntParam,
  parseStringParam,
  parseArrayParam,
} from "/lib/util/params";

import {
  useApolloClient,
  useBreakpoint,
  useSearchParams,
  SearchParamsMap,
  useQuery,
  UseQueryResult,
  useRouter,
} from "/lib/component/util";
import { MobileFullWidthContent, Content } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  ChecksList,
  checksListFragments,
  ChecksListToolbar,
  NotFound,
} from "/lib/component/partial";
import { ChecksListVariables } from "/lib/component/partial/ChecksList/ChecksList";

import createSilence from "/lib/mutation/createSilence";
import deleteSilence from "/lib/mutation/deleteSilence";
import executeCheck from "/lib/mutation/executeCheck";
import setPublish from "/lib/mutation/setCheckPublish";

interface Variables extends ChecksListVariables {
  namespace: string;
}

export const checksViewFragments = {
  namespace: gql`
    fragment ChecksView_namespace on Namespace {
      id
      ...ChecksList_namespace
      ...AppLayout_namespace
    }

    ${checksListFragments.namespace}
    ${AppLayout.fragments.namespace}
  `,
};

export const ChecksViewQuery = gql`
  query ChecksViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: CheckListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      id
      ...ChecksView_namespace
    }
  }

  ${checksViewFragments.namespace}
`;

export function useChecksViewQueryVariables(): Variables {
  const [params] = useSearchParams();
  const limit = parseIntParam(params.limit, 25);
  const offset = parseIntParam(params.offset, 0);
  const order = parseStringParam(params.order, "NAME");
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
}

interface ChecksViewContentProps {
  toolbarContent?: React.ReactNode;
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
  onCreateSilence: (_: any) => void;
  onDeleteSilence: (_: any) => void;
  onExecute: (_: any) => Promise<void>;
  onPublish: (_: any) => Promise<void>;
}

export const ChecksViewContent = ({
  toolbarContent,
  toolbarItems,
  query,
  variables,
  ...props
}: ChecksViewContentProps) => {
  const [, setParams] = useSearchParams();
  const isSmViewport = !useBreakpoint("sm", "gt");

  const { aborted, data = {}, networkStatus, refetch } = query;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;
  if (!data.namespace && !loading && !aborted) {
    return (
      <AppLayout>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout loading={aborted || loading}>
      <div>
        <Content marginBottom>
          <ChecksListToolbar
            onClickReset={() => {
              setParams(
                (params): SearchParamsMap => ({
                  ...params,
                  filters: undefined,
                  order: undefined,
                }),
              );
            }}
            toolbarContent={toolbarContent}
            toolbarItems={toolbarItems}
          />
        </Content>
        <MobileFullWidthContent>
          <ChecksList
            editable={!isSmViewport}
            limit={variables.limit}
            offset={variables.offset}
            namespace={(data || {}).namespace}
            loading={(loading && !data.namespace) || aborted}
            refetch={refetch}
            order={variables.order}
            {...props}
          />
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

ChecksViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const ChecksView = () => {
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

  const variables = useChecksViewQueryVariables();
  const query = useQuery({
    query: ChecksViewQuery,
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

  return (
    <ChecksViewContent
      query={query}
      variables={variables}
      onCreateSilence={onCreateSilence}
      onDeleteSilence={onDeleteSilence}
      onExecute={onExecute}
      onPublish={onPublish}
    />
  );
};
