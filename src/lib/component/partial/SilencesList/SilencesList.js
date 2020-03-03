import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "/vendor/@material-ui/core";

import { TableListEmptyState, Loader } from "/lib/component/base";
import { ListController } from "/lib/component/controller";

import ClearSilencedEntriesDialog from "/lib/component/partial/ClearSilencedEntriesDialog";
import Pagination from "/lib/component/partial/Pagination";

import ListHeader from "./SilencesListHeader";
import ListItem from "./SilencesListItem";

class SilencesList extends React.Component {
  static propTypes = {
    editable: PropTypes.bool,
    filters: PropTypes.array,
    loading: PropTypes.bool,
    limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    namespace: PropTypes.shape({
      silences: PropTypes.shape({
        nodes: PropTypes.array.isRequired,
      }),
    }),
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChangeFilters: PropTypes.func,
    onChangeQuery: PropTypes.func.isRequired,
    onDeleteSilence: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
  };

  static defaultProps = {
    editable: false,
    filters: {},
    loading: false,
    limit: undefined,
    namespace: null,
    offset: undefined,
    onChangeFilters: () => null,
  };

  static fragments = {
    namespace: gql`
      fragment SilencesList_namespace on Namespace {
        silences(
          limit: $limit
          offset: $offset
          orderBy: $order
          filters: $filters
        ) @connection(key: "silences", filter: ["filters", "orderBy"]) {
          nodes {
            id
            deleted @client
            ...SilencesListItem_silence
            ...ClearSilencedEntriesDialog_silence
          }

          pageInfo {
            ...Pagination_pageInfo
          }
        }

        ...SilencesListHeader_namespace
      }

      ${ListHeader.fragments.namespace}
      ${Pagination.fragments.pageInfo}
      ${ClearSilencedEntriesDialog.fragments.silence}
      ${ListItem.fragments.silence}
    `,
  };

  state = {
    openClearDialog: false,
    selectedItems: [],
  };

  openSilenceDialog = targets => {
    this.setState({ openClearDialog: true });
    this.setState({ selectedItems: targets });
  };

  _handleChangeSort = val => {
    let newVal = val;
    this.props.onChangeQuery(query => {
      // Toggle between ASC & DESC
      const curVal = query.get("order");
      if (curVal === "ID" && newVal === "ID") {
        newVal = "ID_DESC";
      }
      query.set("order", newVal);
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
              Try refining your search query in the search box. The filter
              buttons above are also a helpful way of quickly finding entities.
            "
          />
        </TableCell>
      </TableRow>
    );
  };

  renderItem = ({
    key,
    item,
    hovered,
    setHovered,
    selectedCount,
    selected,
    setSelected,
  }) => (
    <ListItem
      key={key}
      editable={this.props.editable}
      editing={selectedCount > 0}
      silence={item}
      hovered={hovered}
      onHover={setHovered}
      selected={selected}
      onClickClearSilences={() => {
        this.openSilenceDialog([item]);
        setSelected([item]);
      }}
      onClickSelect={setSelected}
    />
  );

  render() {
    const {
      editable,
      filters,
      loading,
      limit,
      namespace,
      offset,
      order,
      onChangeFilters,
      onChangeQuery,
      onDeleteSilence,
    } = this.props;

    const items = namespace
      ? namespace.silences.nodes.filter(node => !node.deleted)
      : [];

    return (
      <ListController
        items={items}
        getItemKey={check => check.id}
        renderEmptyState={this.renderEmptyState}
        renderItem={this.renderItem}
      >
        {({ children, selectedItems, toggleSelectedItems }) => (
          <React.Fragment>
            <Paper>
              <Loader loading={loading}>
                <ListHeader
                  editable={editable}
                  filters={filters}
                  rowCount={children.length || 0}
                  selectedItems={selectedItems}
                  namespace={namespace}
                  onChangeQuery={onChangeQuery}
                  onClickSelect={toggleSelectedItems}
                  onClickClearSilences={() =>
                    this.openSilenceDialog(selectedItems)
                  }
                  onChangeFilters={onChangeFilters}
                  order={order}
                />

                <Table>
                  <TableBody>{children}</TableBody>
                </Table>

                <Pagination
                  limit={limit}
                  offset={offset}
                  pageInfo={namespace && namespace.silences.pageInfo}
                  onChangeQuery={ch => onChangeQuery(ex => ({ ...ex, ...ch }))}
                />
              </Loader>
            </Paper>
            <ClearSilencedEntriesDialog
              confirmed
              silences={this.state.selectedItems}
              open={this.state.openClearDialog}
              onClose={() => {
                this.setState({ openClearDialog: false });
                toggleSelectedItems();
              }}
              onSave={onDeleteSilence}
              scrollable
            />
          </React.Fragment>
        )}
      </ListController>
    );
  }
}

export default SilencesList;
