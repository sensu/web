import React from "/vendor/react";
import PropTypes from "prop-types";
import { withApollo } from "/vendor/react-apollo";
import gql from "/vendor/graphql-tag";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "/vendor/@material-ui/core";

import deleteEvent from "/lib/mutation/deleteEvent";
import executeCheckMutation from "/lib/mutation/executeCheck";
import resolveEvent from "/lib/mutation/resolveEvent";

import { Loader, TableListEmptyState } from "/lib/component/base";
import { ListController } from "/lib/component/controller";
import { useExecuteCheckStatusToast } from "/lib/component/toast";

import Pagination from "/lib/component/partial/Pagination";
import SilenceEntryDialog from "/lib/component/partial/SilenceEntryDialog";
import ClearSilencedEntriesDialog from "/lib/component/partial/ClearSilencedEntriesDialog";

import EventsListHeader from "./EventsListHeader";
import EventsListItem from "./EventsListItem";

const EventsList = ({
  client,
  editable,
  loading,
  limit,
  namespace,
  offset,
  onChangeQuery,
  refetch,
}) => {
  const [silence, setSilence] = React.useState(null);
  const [unsilence, setUnsilence] = React.useState(null);

  const createExecuteCheckStatusToast = useExecuteCheckStatusToast();

  const resolveEvents = events => {
    events.forEach(event => resolveEvent(client, { id: event.id }));
  };

  const deleteEvents = events => {
    events.forEach(event => deleteEvent(client, { id: event.id }));
  };

  const executeCheck = events => {
    events.forEach(({ check, entity }) => {
      // Unless this is a proxy entity target the specific entity
      let subscriptions = [`entity:${entity.name}`];
      if (check.proxyEntityName === entity.name) {
        subscriptions = [];
      }

      const promise = executeCheckMutation(client, {
        id: check.nodeId,
        subscriptions,
      });

      createExecuteCheckStatusToast(promise, {
        checkName: check.name,
        namespace: check.namespace,
      });
    });
  };

  const clearSilences = items => {
    setUnsilence(
      items
        .filter(item => item.silences.length > 0)
        .reduce((memo, item) => [...memo, ...item.silences], []),
    );
  };

  const silenceEvents = events => {
    const targets = events.map(event => ({
      namespace: event.namespace,
      subscription: `entity:${event.entity.name}`,
      check: event.check.name,
    }));

    if (targets.length === 1) {
      setSilence({
        ...targets[0],
        props: {
          begin: null,
        },
      });
    } else if (targets.length) {
      setSilence({
        props: {
          begin: null,
        },
        targets,
      });
    }
  };

  const silenceEntity = event => {
    setSilence({
      namespace: event.namespace,
      check: "*",
      subscription: `entity:${event.entity.name}`,
      props: {
        begin: null,
      },
    });
  };

  const silenceCheck = event => {
    setSilence({
      namespace: event.namespace,
      check: event.check.name,
      subscription: "*",
      props: {
        begin: null,
      },
    });
  };

  const items = namespace
    ? namespace.events.nodes.filter(event => !event.deleted)
    : [];

  return (
    <ListController
      items={items}
      // Event ID includes timestamp and cannot be reliably used to identify
      // an event between refreshes, subscriptions and mutations.
      getItemKey={event => `${event.check.name}:::${event.entity.name}`}
      renderEmptyState={() => {
        return (
          <TableRow>
            <TableCell>
              <TableListEmptyState
                loading={loading}
                primary="No results matched your query."
                secondary="
          Try refining your search query in the search box. The filter buttons
          above are also a helpful way of quickly finding events.
        "
              />
            </TableCell>
          </TableRow>
        );
      }}
      renderItem={({
        key,
        item,
        selectedCount,
        hovered,
        setHovered,
        selected,
        setSelected,
      }) => (
        <EventsListItem
          key={key}
          event={item}
          editable={editable}
          editing={selectedCount > 0}
          selected={selected}
          onChangeSelected={setSelected}
          hovered={hovered}
          onHover={editable ? setHovered : () => null}
          onClickClearSilences={() => clearSilences([item])}
          onClickSilencePair={() => silenceEvents([item])}
          onClickSilenceEntity={() => silenceEntity(item)}
          onClickSilenceCheck={() => silenceCheck(item)}
          onClickResolve={() => resolveEvents([item])}
          onClickRerun={() => executeCheck([item])}
          onClickDelete={() => deleteEvents([item])}
        />
      )}
    >
      {({ children, selectedItems, setSelectedItems, toggleSelectedItems }) => (
        <Paper>
          <Loader loading={loading}>
            <EventsListHeader
              editable={editable}
              namespace={namespace}
              onClickSelect={toggleSelectedItems}
              onClickClearSilences={() => clearSilences(selectedItems)}
              onClickSilence={() => silenceEvents(selectedItems)}
              onClickResolve={() => {
                resolveEvents(selectedItems);
                setSelectedItems([]);
              }}
              onClickRerun={() => {
                executeCheck(selectedItems);
                setSelectedItems([]);
              }}
              onClickDelete={() => {
                deleteEvents(selectedItems);
                setSelectedItems([]);
              }}
              onChangeQuery={onChangeQuery}
              rowCount={children.length || 0}
              selectedItems={selectedItems}
            />

            <Table>
              <TableBody>{children}</TableBody>
            </Table>

            <Pagination
              limit={limit}
              offset={offset}
              pageInfo={namespace && namespace.events.pageInfo}
              onChangeQuery={onChangeQuery}
            />

            <ClearSilencedEntriesDialog
              silences={unsilence}
              open={!!unsilence}
              close={() => {
                setUnsilence(null);
                setSelectedItems([]);
                refetch();
              }}
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
          </Loader>
        </Paper>
      )}
    </ListController>
  );
};

EventsList.propTypes = {
  client: PropTypes.object.isRequired,
  editable: PropTypes.bool,
  namespace: PropTypes.shape({
    checks: PropTypes.object,
    entities: PropTypes.object,
  }),
  onChangeQuery: PropTypes.func.isRequired,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool,
  refetch: PropTypes.func.isRequired,
};

EventsList.defaultProps = {
  loading: false,
  editable: true,
  namespace: null,
  limit: undefined,
  offset: undefined,
};

EventsList.fragments = {
  namespace: gql`
    fragment EventsList_namespace on Namespace {
      checks(limit: 1000) {
        nodes {
          name
        }
      }

      entities(limit: 1000) {
        nodes {
          name
        }
      }

      events(limit: $limit, offset: $offset, filter: $filter, orderBy: $order)
        @connection(key: "events", filter: ["filter", "orderBy"]) {
        nodes {
          id
          namespace
          deleted @client

          entity {
            name
          }

          check {
            nodeId
            name
            proxyEntityName
          }

          silences {
            ...ClearSilencedEntriesDialog_silence
          }

          ...EventsListHeader_event
          ...EventsListItem_event
        }

        pageInfo {
          ...Pagination_pageInfo
        }
      }

      ...EventsListHeader_namespace
    }

    ${ClearSilencedEntriesDialog.fragments.silence}
    ${EventsListHeader.fragments.namespace}
    ${EventsListHeader.fragments.event}
    ${EventsListItem.fragments.event}
    ${Pagination.fragments.pageInfo}
  `,
};

export default withApollo(EventsList);
