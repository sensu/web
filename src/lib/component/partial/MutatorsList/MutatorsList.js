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

import MutatorsListHeader from "./MutatorsListHeader";
import MutatorsListItem from "./MutatorsListItem";

const MutatorsList = ({
  editable,
  loading,
  limit,
  namespace,
  offset,
  order,
  onChangeQuery,
}) => {
  const items = namespace
    ? namespace.mutators.nodes.filter(hd => !hd.deleted)
    : [];

  return (
    <ListController
      items={items}
      getItemKey={mutator => mutator.id}
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
      renderItem={({ key, item: mutator }) => (
        <MutatorsListItem key={key} mutator={mutator} />
      )}
    >
      {({ children, selectedItems }) => (
        <Paper>
          <Loader loading={loading}>
            <MutatorsListHeader
              editable={editable}
              selectedItems={selectedItems}
              rowCount={children.length || 0}
              order={order}
              onChangeQuery={onChangeQuery}
            />
            <Table>
              <TableBody>{children}</TableBody>
            </Table>

            <Pagination
              limit={limit}
              offset={offset}
              pageInfo={namespace && namespace.mutators.pageInfo}
              onChangeQuery={onChangeQuery}
            />
          </Loader>
        </Paper>
      )}
    </ListController>
  );
};

MutatorsList.propTypes = {
  editable: PropTypes.bool,
  namespace: PropTypes.shape({
    mutators: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }),
  loading: PropTypes.bool,
  onChangeQuery: PropTypes.func.isRequired,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  order: PropTypes.string.isRequired,
};

MutatorsList.defaultProps = {
  editable: true,
  namespace: null,
  loading: false,
  limit: undefined,
  offset: undefined,
  onChangeFilters: () => null,
};

MutatorsList.fragments = {
  namespace: gql`
    fragment MutatorsList_namespace on Namespace {
      mutators(
        limit: $limit
        offset: $offset
        orderBy: $order
        filters: $filters
      ) @connection(key: "mutators", filter: ["filters", "orderBy"]) {
        nodes {
          id
          deleted @client
          ...MutatorsListItem_mutator
        }

        pageInfo {
          ...Pagination_pageInfo
        }
      }
    }
    ${MutatorsListItem.fragments.mutator}
    ${Pagination.fragments.pageInfo}
  `,
};

export default withApollo(MutatorsList);
