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
  useFilterParams,
  useSearchParams,
  useQuery,
  useRouter,
  UseQueryResult,
  WithWidth,
} from "/lib/component/util";
import {
  Content,
  MobileFullWidthContent,
} from "/lib/component/base";
import {
  AppLayout,
  BoundFilterList,
  NotFound,
  SilencesList,
  SilencesListToolbar,
  SilenceEntryDialog,
} from "/lib/component/partial";

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
}

export function useSilencesViewQueryVariables(): Variables {
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

export const silencesViewFragments = {
  namespace: gql`
    fragment SilencesView_namespame on Namespace {
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
      ...SilencesList_namespace
    }
  }

  ${silencesViewFragments.namespace}
`;

interface WithDialogProps {
  children: (_: any) => JSX.Element;
}

const WithDialogState = ({ children }: WithDialogProps) => {
  const [isOpen, setOpen] = React.useState(false);

  return children({
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
  });
};

export const SilencesViewContent = ({
  toolbarContent,
  toolbarItems,
  query,
  variables,
}: Props) => {
  const [, setQueryParams] = useSearchParams();
  const [, setFilters] = useFilterParams();

  const { data = {}, networkStatus, aborted, refetch } = query;
  const { namespace } = data;

  // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
  const loading = networkStatus < 6;

  const onClickReset = React.useCallback(
    () =>
      setQueryParams((params) => ({
        ...params,
        filters: undefined,
        order: undefined,
      })),
    [setQueryParams],
  );

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
        <WithDialogState>
          {(newDialog) => (
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
                  values={{
                    namespace: namespace,
                    props: {},
                  }}
                  onClose={() => {
                    // TODO: Only refetch / poison list on success
                    refetch();
                    newDialog.close();
                  }}
                />
              )}
            </React.Fragment>
          )}
        </WithDialogState>
        <MobileFullWidthContent>
          <WithWidth>
            {({ width }) => (
              <SilencesList
                editable={width !== "xs"}
                limit={variables.limit}
                offset={variables.offset}
                order={variables.order}
                filters={variables.filters}
                onChangeFilters={setFilters}
                onChangeQuery={setQueryParams}
                namespace={namespace}
                loading={(loading && !namespace) || aborted}
                refetch={refetch}
              />
            )}
          </WithWidth>
        </MobileFullWidthContent>
      </div>
    </AppLayout>
  );
};

SilencesViewContent.defaultProps = {
  toolbarContent: <BoundFilterList />,
};

export const SilencesView = () => {
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

  return <SilencesViewContent query={query} variables={variables} />;
};
