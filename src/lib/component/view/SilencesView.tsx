import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { ApolloError } from "/vendor/apollo-client";
import { FailedError } from "/lib/error/FetchError";
import { PollingDuration } from "../../constant";

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
  useRouter,
  UseQueryResult,
} from "/lib/component/util";
import { Content, MobileFullWidthContent } from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  NotFound,
  SilencesList,
  SilencesListToolbar,
  SilenceEntryDialog,
} from "/lib/component/partial";
import createSilence from "/lib/mutation/createSilence";
import deleteSilence from "/lib/mutation/deleteSilence";

interface Variables {
  namespace: string;
  filters: string[];
  order: string;
  limit: number;
  offset: number;
}

interface Props {
  toolbarContent?: React.ReactNode;
  toolbarItems?: React.ReactNode;
  query: UseQueryResult<any, any>;
  variables: Variables;
  onCreateSilence: (vars: any) => void;
  onDeleteSilence: (vars: any) => void;
}

export function useSilencesViewQueryVariables(): Variables {
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
}

export const silencesViewFragments = {
  namespace: gql`
    fragment SilencesView_namespace on Namespace {
      id
      ...SilencesList_namespace
    }

    ${SilencesList.fragments.namespace}
  `,
};

export const silencesViewQuery = gql`
  query SilencesViewQuery(
    $namespace: String!
    $limit: Int
    $offset: Int
    $order: SilencesListOrder
    $filters: [String!]
  ) {
    namespace(name: $namespace) {
      ...SilencesView_namespace
    }
  }

  ${silencesViewFragments.namespace}
`;

const useDialogState = () => {
  const [isOpen, setOpen] = React.useState(false);

  return React.useMemo(
    () => ({
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [isOpen, setOpen],
  );
};

export const SilencesViewContent = ({
  toolbarContent,
  toolbarItems,
  query,
  variables,
  onCreateSilence,
  onDeleteSilence,
}: Props) => {
  const [, setFilters] = useFilterParams();
  const [, setParams] = useSearchParams();
  const isSmViewport = !useBreakpoint("sm", "gt");

  const { data = {}, networkStatus, aborted, refetch } = query;
  const { namespace } = data;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  const onClickReset = React.useCallback(
    () =>
      setParams((params) => ({
        ...params,
        filters: undefined,
        order: undefined,
      })),
    [setParams],
  );

  const newDialog = useDialogState();
  const newDialogDefaults = React.useMemo(
    () => ({ namespace: variables.namespace, props: {} }),
    [variables.namespace],
  );
  const onCloseNewDialog = React.useCallback(() => {
    // TODO: Only refetch / poison list on success
    refetch();
    newDialog.close();
  }, [newDialog, refetch]);

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
        <React.Fragment>
          <Content marginBottom>
            <SilencesListToolbar
              onClickCreate={newDialog.open}
              onClickReset={onClickReset}
              toolbarContent={toolbarContent}
              toolbarItems={toolbarItems}
            />
          </Content>

          {newDialog.isOpen && (
            <SilenceEntryDialog
              values={newDialogDefaults}
              onSave={onCreateSilence}
              onClose={onCloseNewDialog}
            />
          )}
        </React.Fragment>
        <MobileFullWidthContent>
          <SilencesList
            editable={!isSmViewport}
            limit={variables.limit}
            offset={variables.offset}
            order={variables.order}
            filters={variables.filters}
            onChangeFilters={setFilters}
            onChangeQuery={setParams}
            onDeleteSilence={onDeleteSilence}
            namespace={namespace}
            loading={(loading && !namespace) || aborted}
            refetch={refetch}
          />
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

SilencesViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const SilencesView = () => {
  const client = useApolloClient();
  const onCreate = React.useCallback(
    (vars: any) => createSilence(client, vars),
    [client],
  );
  const onDelete = React.useCallback(
    (vars: any) => deleteSilence(client, vars),
    [client],
  );

  const variables = useSilencesViewQueryVariables();
  const query = useQuery({
    query: silencesViewQuery,
    fetchPolicy: "cache-and-network",
    pollInterval: PollingDuration.short,
    variables,
    onError: (error: Error) => {
      if ((error as ApolloError).networkError instanceof FailedError) {
        return;
      }

      throw error;
    },
  });

  return (
    <SilencesViewContent
      query={query}
      variables={variables}
      onCreateSilence={onCreate}
      onDeleteSilence={onDelete}
    />
  );
};
