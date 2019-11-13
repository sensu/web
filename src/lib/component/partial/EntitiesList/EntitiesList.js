import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "/vendor/@material-ui/core";

import { TableListEmptyState, Loader } from "/lib/component/base";
import { ListController } from "/lib/component/controller";

import deleteEntity from "/lib/mutation/deleteEntity";

import Pagination from "/lib/component/partial/Pagination";
import SilenceEntryDialog from "/lib/component/partial/SilenceEntryDialog";
import ClearSilencedEntriesDialog from "/lib/component/partial/ClearSilencedEntriesDialog";

import EntitiesListHeader from "./EntitiesListHeader";
import EntitiesListItem from "./EntitiesListItem";

class EntitiesList extends React.PureComponent {
  static propTypes = {
    // from withApollo HOC
    client: PropTypes.object.isRequired,
    editable: PropTypes.bool,
    loading: PropTypes.bool,
    namespace: PropTypes.object,
    order: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    onChangeFilters: PropTypes.func.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    refetch: PropTypes.func,
  };

  static defaultProps = {
    editable: false,
    loading: false,
    limit: undefined,
    namespace: null,
    offset: undefined,
    refetch: () => null,
  };

  static fragments = {
    namespace: gql`
      fragment EntitiesList_namespace on Namespace {
        entities(
          limit: $limit
          offset: $offset
          filters: $filters
          orderBy: $order
        ) @connection(key: "entities", filter: ["filters", "orderBy"]) {
          nodes {
            id
            namespace
            deleted @client

            silences {
              ...ClearSilencedEntriesDialog_silence
            }

            ...EntitiesListItem_entity
          }

          pageInfo {
            ...Pagination_pageInfo
          }
        }
        ...EntitiesListHeader_namespace
      }

      ${ClearSilencedEntriesDialog.fragments.silence}
      ${EntitiesListHeader.fragments.namespace}
      ${EntitiesListItem.fragments.entity}
      ${Pagination.fragments.pageInfo}
    `,
  };

  state = {
    silence: null,
    unsilence: null,
  };

  deleteEntities = entities => {
    entities.forEach(entity =>
      deleteEntity(this.props.client, { id: entity.id }),
    );
  };

  silenceItems = entities => {
    const targets = entities
      .filter(entity => entity.silences.length === 0)
      .map(entity => ({
        namespace: entity.namespace,
        check: "*",
        subscription: `entity:${entity.name}`,
      }));

    if (targets.length === 1) {
      this.setState({
        silence: {
          props: {},
          ...targets[0],
        },
      });
    } else if (targets.length) {
      this.setState({
        silence: { props: {}, targets },
      });
    }
  };

  clearSilences = items => {
    this.setState({
      unsilence: items.reduce((memo, item) => [...memo, ...item.silences], []),
    });
  };

  renderEmptyState = () => {
    const { loading } = this.props;

    return (
      <TableRow>
        <TableCell>
          <TableListEmptyState
            loading={loading}
            primary="No results matched your query."
            secondary="
          Try refining your search query in the search box. The filter buttons
          above are also a helpful way of quickly finding entities.
        "
          />
        </TableCell>
      </TableRow>
    );
  };

  renderEntity = ({
    key,
    item: entity,
    hovered,
    setHovered,
    selectedCount,
    selected,
    setSelected,
  }) => (
    <EntitiesListItem
      key={key}
      editable={this.props.editable}
      editing={selectedCount > 0}
      entity={entity}
      hovered={hovered}
      onHover={this.props.editable ? setHovered : () => null}
      selected={selected}
      onChangeSelected={setSelected}
      onClickDelete={() => this.deleteEntities([entity])}
      onClickSilence={() => this.silenceItems([entity])}
      onClickClearSilence={() => this.clearSilences([entity])}
    />
  );

  render() {
    const { silence, unsilence } = this.state;
    const {
      editable,
      filters,
      loading,
      onChangeFilters,
      onChangeQuery,
      limit,
      namespace,
      offset,
      refetch,
      order,
    } = this.props;

    const items = namespace
      ? namespace.entities.nodes.filter(entity => !entity.deleted)
      : [];

    return (
      <ListController
        items={items}
        getItemKey={entity => entity.id}
        renderEmptyState={this.renderEmptyState}
        renderItem={this.renderEntity}
      >
        {({
          children,
          selectedItems,
          setSelectedItems,
          toggleSelectedItems,
        }) => (
          <Paper>
            <Loader loading={loading}>
              <EntitiesListHeader
                editable={editable}
                filters={filters}
                selectedItems={selectedItems}
                rowCount={children.length || 0}
                onClickSelect={toggleSelectedItems}
                onClickDelete={() => this.deleteEntities(selectedItems)}
                onClickSilence={() => this.silenceItems(selectedItems)}
                onClickClearSilences={() => this.clearSilences(selectedItems)}
                onChangeFilters={onChangeFilters}
                onChangeQuery={onChangeQuery}
                namespace={namespace}
                order={order}
              />

              <Table>
                <TableBody>{children}</TableBody>
              </Table>

              <Pagination
                limit={limit}
                offset={offset}
                pageInfo={namespace && namespace.entities.pageInfo}
                onChangeQuery={onChangeQuery}
              />

              <ClearSilencedEntriesDialog
                silences={unsilence}
                open={!!unsilence}
                close={() => {
                  this.setState({ unsilence: null });
                  setSelectedItems([]);
                  refetch();
                }}
              />

              {silence && (
                <SilenceEntryDialog
                  values={silence}
                  onClose={() => {
                    this.setState({ silence: null });
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
  }
}

export default EntitiesList;
