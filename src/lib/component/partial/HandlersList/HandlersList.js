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

import { ListController } from "/lib/component/controller";
import { Loader, TableListEmptyState } from "/lib/component/base";

import Pagination from "/lib/component/partial/Pagination";

import HandlersListHeader from "./HandlersListHeader";
import HandlersListItem from "./HandlersListItem";

const HandlersList = ({
  editable,
  loading,
  filters,
  limit,
  namespace,
  offset,
  order,
  onChangeQuery,
  onChangeFilters,
}) => {
  const items = namespace
    ? namespace.handlers.nodes.filter(hd => !hd.deleted)
    : [];

  return (
    <ListController
      items={items}
      getItemKey={handler => handler.id}
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
      renderItem={({ key, item: handler }) => (
        <HandlersListItem key={key} handler={handler} />
      )}
    >
      {({ children, selectedItems }) => (
        <Paper>
          <Loader loading={loading}>
            <HandlersListHeader
              editable={editable}
              filters={filters}
              selectedItems={selectedItems}
              rowCount={children.length || 0}
              order={order}
              onChangeFilters={onChangeFilters}
              onChangeQuery={onChangeQuery}
            />
            <Table>
              <TableBody>{children}</TableBody>
            </Table>

            <Pagination
              limit={limit}
              offset={offset}
              pageInfo={namespace && namespace.handlers.pageInfo}
              onChangeQuery={onChangeQuery}
            />
          </Loader>
        </Paper>
      )}
    </ListController>
  );
};

HandlersList.propTypes = {
  editable: PropTypes.bool,
  namespace: PropTypes.shape({
    handlers: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }),
  loading: PropTypes.bool,
  filters: PropTypes.object,
  onChangeFilters: PropTypes.func,
  onChangeQuery: PropTypes.func.isRequired,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  order: PropTypes.string.isRequired,
};

HandlersList.defaultProps = {
  editable: true,
  namespace: null,
  loading: false,
  limit: undefined,
  offset: undefined,
  filters: {},
  onChangeFilters: () => null,
};

HandlersList.fragments = {
  namespace: gql`
    fragment HandlersList_namespace on Namespace {
      handlers(
        limit: $limit
        offset: $offset
        orderBy: $order
        filters: $filters
      ) @connection(key: "handlers", filter: ["filters", "orderBy"]) {
        nodes {
          id
          deleted @client
          ...HandlersListItem_handler
        }

        pageInfo {
          ...Pagination_pageInfo
        }
      }
    }
    ${HandlersListItem.fragments.handler}
    ${Pagination.fragments.pageInfo}
  `,
};

export default withApollo(HandlersList);
