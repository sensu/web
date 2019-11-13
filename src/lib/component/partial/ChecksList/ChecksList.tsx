import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "/vendor/@material-ui/core";

import executeCheck from "/lib/mutation/executeCheck";
import setCheckPublish from "/lib/mutation/setCheckPublish";

import {
  useSearchParams,
  useFilterParams,
  useApolloClient,
} from "/lib/component/util";
import { ListController } from "/lib/component/controller";
import { Loader, TableListEmptyState } from "/lib/component/base";

import ClearSilencedEntriesDialog from "/lib/component/partial/ClearSilencedEntriesDialog";
import Pagination from "/lib/component/partial/Pagination";
import SilenceEntryDialog from "/lib/component/partial/SilenceEntryDialog";

import {
  usePublishCheckStatusToast,
  useExecuteCheckStatusToast,
} from "/lib/component/toast";

import ChecksListHeader from "./ChecksListHeader";
import ChecksListItem from "./ChecksListItem";

export interface ChecksListVariables {
  limit: number;
  offset: number;
  order: string;
  filters: string[];
}

export const checksListFragments = {
  namespace: gql`
    fragment ChecksList_namespace on Namespace {
      id
      checks(
        limit: $limit
        offset: $offset
        orderBy: $order
        filters: $filters
      ) @connection(key: "checks", filter: ["filters", "orderBy"]) {
        nodes {
          id
          deleted @client
          name
          namespace
          silences {
            name
            ...ClearSilencedEntriesDialog_silence
          }

          ...ChecksListItem_check
        }

        pageInfo {
          ...Pagination_pageInfo
        }
      }

      ...ChecksListHeader_namespace
    }

    ${ChecksListHeader.fragments.namespace}
    ${ChecksListItem.fragments.check}
    ${ClearSilencedEntriesDialog.fragments.silence}
    ${Pagination.fragments.pageInfo}
  `,
};

interface Check {
  id: string;
  deleted: boolean;
  name: string;
  namespace: string;
  silences: unknown[];
  pageInfo: unknown;
}

interface PageInfo {
  totalCount: number;
}

interface Namespace {
  checks: {
    pageInfo: PageInfo;
    nodes: Check[];
  };
}

interface Props {
  editable: boolean;
  loading: boolean;
  limit?: number;
  namespace?: Namespace;
  offset?: number;
  order?: string;
  refetch(): void;
}

const ChecksList = ({
  editable,
  loading,
  limit,
  namespace,
  offset,
  order,
  refetch,
}: Props) => {
  const client = useApolloClient();

  const [, setParams] = useSearchParams();
  const [filters, setFilters] = useFilterParams();

  const [silence, setSilence] = React.useState<any>(null);
  const [unsilence, setUnsilence] = React.useState<any>(null);

  const createPublishCheckStatusToast = usePublishCheckStatusToast();
  const createExecuteCheckStatusToast = useExecuteCheckStatusToast();

  const setChecksPublish = (checks: Check[], publish: boolean = true) => {
    checks.forEach((check) => {
      const promise = setCheckPublish(client, {
        id: check.id,
        publish,
      });

      createPublishCheckStatusToast(promise, {
        checkName: check.name,
        publish,
      });
    });
  };

  const silenceChecks = (checks: Check[]) => {
    const targets = checks
      .filter((check) => check.silences.length === 0)
      .map((check) => ({
        namespace: check.namespace,
        check: check.name,
      }));

    if (targets.length === 1) {
      setSilence({ props: {}, ...targets[0] });
    } else if (targets.length) {
      setSilence({ props: {}, targets });
    }
  };

  const clearSilences = (checks: Check[]) => {
    setUnsilence(
      checks.reduce(
        (memo: unknown[], check) => [...memo, ...check.silences],
        [],
      ),
    );
  };

  const executeChecks = (checks: Check[]) => {
    checks.forEach(({ id, name, namespace: checkNamespace }) => {
      const promise = executeCheck(client, { id });

      createExecuteCheckStatusToast(promise, {
        checkName: name,
        namespace: checkNamespace,
        entityName: undefined,
      });
    });
  };

  const items: Check[] = namespace
    ? namespace.checks.nodes.filter((ch: Check) => !ch.deleted)
    : [];

  return (
    <ListController
      items={items}
      getItemKey={(check: Check) => check.id}
      renderEmptyState={() => {
        return (
          <TableRow>
            <TableCell>
              <TableListEmptyState
                loading={loading}
                primary="No results matched your query."
                secondary="
              Try refining your search query in the search box. The filter
              buttons above are also a helpful way of quickly finding entities.
            "
              />
            </TableCell>
          </TableRow>
        );
      }}
      renderItem={({
        key,
        item: check,
        hovered,
        setHovered,
        selectedCount,
        selected,
        setSelected,
      }) => (
        <ChecksListItem
          key={key}
          editable={editable}
          editing={selectedCount > 0}
          check={check}
          hovered={hovered}
          onHover={editable ? setHovered : () => null}
          selected={selected}
          onChangeSelected={setSelected}
          onClickClearSilences={() => clearSilences([check])}
          onClickExecute={() => executeChecks([check])}
          onClickSetPublish={(publish: boolean) =>
            setChecksPublish([check], publish)
          }
          onClickSilence={() => silenceChecks([check])}
        />
      )}
    >
      {({ children, selectedItems, setSelectedItems, toggleSelectedItems }) => (
        <Paper>
          <Loader loading={loading}>
            <ChecksListHeader
              editable={editable}
              filters={filters}
              namespace={namespace}
              onChangeFilters={setFilters}
              onClickClearSilences={() => clearSilences(selectedItems)}
              onClickExecute={() => {
                executeChecks(selectedItems);
                setSelectedItems([]);
              }}
              onClickSetPublish={(publish: boolean) => {
                setChecksPublish(selectedItems, publish);
                setSelectedItems([]);
              }}
              onClickSilence={() => silenceChecks(selectedItems)}
              order={order}
              rowCount={items.length}
              selectedItems={selectedItems}
              toggleSelectedItems={toggleSelectedItems}
            />

            <Table>
              <TableBody>{children}</TableBody>
            </Table>

            <Pagination
              limit={limit}
              offset={offset}
              pageInfo={namespace && namespace.checks.pageInfo}
              onChangeQuery={(update: any) =>
                setParams((params) => ({ ...params, ...update }))
              }
            />

            {silence && (
              <SilenceEntryDialog
                values={silence}
                onClose={() => {
                  setSilence(null);
                  setSelectedItems([]);
                  refetch();
                }}
              />
            )}

            <ClearSilencedEntriesDialog
              silences={unsilence}
              open={!!unsilence}
              close={() => {
                setUnsilence(null);
                setSelectedItems([]);
                refetch();
              }}
            />
          </Loader>
        </Paper>
      )}
    </ListController>
  );
};

ChecksList.defaultProps = {
  editable: true,
  namespace: null,
  loading: false,
  limit: undefined,
  offset: undefined,
  filters: {},
  onChangeFilters: () => null,
};

export default ChecksList;
