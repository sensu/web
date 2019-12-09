import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { ApolloError } from "/vendor/apollo-client";
import { isUnreachable } from "/lib/util/fetchError";
import { PollingDuration } from "/lib/constant";

import {
  parseIntParam,
  parseStringParam,
  parseArrayParam,
} from "/lib/util/params";
import {
  useApolloClient,
  useBreakpoint,
  useFilterParams,
  useSearchParams,
  useQuery,
  UseQueryResult,
  useRouter,
} from "/lib/component/util";
import { MobileFullWidthContent, Content } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  EntitiesList,
  EntitiesListToolbar,
  NotFound,
} from "/lib/component/partial";

import createSilence from "/lib/mutation/createSilence";
import deleteSilence from "/lib/mutation/deleteSilence";
import deleteEntity from "/lib/mutation/deleteEntity";

export const entitiesViewFragments = {
  namespace: gql`
    fragment EntitiesView_namespace on Namespace {
      id
      ...EntitiesList_namespace
    }

    ${EntitiesList.fragments.namespace}
  `,
};

const entitiesViewQuery = gql`
  query EntitiesViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: EntityListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      id
      ...EntitiesView_namespace
    }
  }

  ${entitiesViewFragments.namespace}
`;

interface Variables {
  namespace: string;
  limit: number;
  offset: number;
  order: string;
  filters: string[];
}

export const useEntitiesViewQueryVariables = (): Variables => {
  const [params] = useSearchParams();
  const limit = parseIntParam(params.limit, 25);
  const offset = parseIntParam(params.offset, 0);
  const order = parseStringParam(params.order, "ID");
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
};

interface EntitiesViewContentProps {
  toolbarContent?: React.ReactNode;
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
  onCreateSilence: (_: any) => void;
  onDeleteSilence: (_: any) => void;
  onDelete: (_: any) => Promise<any>;
}

export const EntitiesViewContent = ({
  query,
  toolbarContent,
  toolbarItems,
  variables,
  ...props
}: EntitiesViewContentProps) => {
  const [, setFilters] = useFilterParams();
  const [, setParams] = useSearchParams();
  const isSmViewport = !useBreakpoint("sm", "gt");

  const { data = {}, networkStatus, aborted, refetch } = query;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  if (!data.namespace && !loading && !aborted) {
    return (
      <AppLayout namespace={variables.namespace}>
        <NotFound />
      </AppLayout>
    );
  }

  return (
    <AppLayout namespace={variables.namespace}>
      <div>
        <Content marginBottom>
          <EntitiesListToolbar
            onClickReset={() =>
              setParams((params) => ({
                ...params,
                filters: undefined,
                order: undefined,
              }))
            }
            toolbarContent={toolbarContent}
            toolbarItems={toolbarItems}
          />
        </Content>

        <MobileFullWidthContent>
          <EntitiesList
            editable={!isSmViewport}
            limit={variables.limit}
            offset={variables.offset}
            loading={(loading && !data.namespace) || aborted}
            filters={variables.filters}
            onChangeFilters={setFilters}
            onChangeQuery={setParams}
            namespace={data.namespace}
            refetch={refetch}
            order={variables.order}
            {...props}
          />
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

EntitiesViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const EntitiesView = () => {
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

  const variables = useEntitiesViewQueryVariables();
  const query = useQuery({
    query: entitiesViewQuery,
    fetchPolicy: "cache-and-network",
    pollInterval: PollingDuration.short,
    variables,
    onError: (error: Error): void => {
      if (isUnreachable((error as ApolloError).networkError)) {
        return;
      }

      throw error;
    },
  });

  return (
    <EntitiesViewContent
      query={query}
      variables={variables}
      onCreateSilence={onCreateSilence}
      onDeleteSilence={onDeleteSilence}
      onDelete={onDelete}
    />
  );
};
