import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { withApollo } from "/vendor/react-apollo";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "/vendor/@material-ui/core";

import executeCheck from "/lib/mutation/executeCheck";
import setCheckPublish from "/lib/mutation/setCheckPublish";

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

const ChecksList = ({
  client,
  editable,
  loading,
  limit,
  namespace,
  offset,
  order,
  onChangeQuery,
  refetch,
}) => {
  const [silence, setSilence] = React.useState(null);
  const [unsilence, setUnsilence] = React.useState(null);

  const createPublishCheckStatusToast = usePublishCheckStatusToast();
  const createExecuteCheckStatusToast = useExecuteCheckStatusToast();

  const setChecksPublish = (checks, publish = true) => {
    checks.forEach(check => {
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

  const silenceChecks = checks => {
    const targets = checks
      .filter(check => check.silences.length === 0)
      .map(check => ({
        namespace: check.namespace,
        check: check.name,
      }));

    if (targets.length === 1) {
      setSilence({ props: {}, ...targets[0] });
    } else if (targets.length) {
      setSilence({ props: {}, targets });
    }
  };

  const clearSilences = checks => {
    setUnsilence(checks.reduce((memo, ch) => [...memo, ...ch.silences], []));
  };

  const executeChecks = checks => {
    checks.forEach(({ id, name, namespace: checkNamespace }) => {
      const promise = executeCheck(client, { id });

      createExecuteCheckStatusToast(promise, {
        checkName: name,
        namespace: checkNamespace,
      });
    });
  };

  const items = namespace
    ? namespace.checks.nodes.filter(ch => !ch.deleted)
    : [];

  return (
    <ListController
      items={items}
      getItemKey={check => check.id}
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
          onClickSetPublish={publish => setChecksPublish([check], publish)}
          onClickSilence={() => silenceChecks([check])}
        />
      )}
    >
      {({ children, selectedItems, setSelectedItems, toggleSelectedItems }) => (
        <Paper>
          <Loader loading={loading}>
            <ChecksListHeader
              editable={editable}
              namespace={namespace}
              onChangeQuery={onChangeQuery}
              onClickClearSilences={() => clearSilences(selectedItems)}
              onClickExecute={() => {
                executeChecks(selectedItems);
                setSelectedItems([]);
              }}
              onClickSetPublish={publish => {
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
              onChangeQuery={onChangeQuery}
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

ChecksList.propTypes = {
  client: PropTypes.object.isRequired,
  editable: PropTypes.bool,
  namespace: PropTypes.shape({
    checks: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }),
  loading: PropTypes.bool,
  onChangeQuery: PropTypes.func.isRequired,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  order: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
};

ChecksList.defaultProps = {
  editable: true,
  namespace: null,
  loading: false,
  limit: undefined,
  offset: undefined,
};

ChecksList.fragments = {
  namespace: gql`
    fragment ChecksList_namespace on Namespace {
      checks(limit: $limit, offset: $offset, orderBy: $order, filter: $filter)
        @connection(key: "checks", filter: ["filter", "orderBy"]) {
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

export default withApollo(ChecksList);
