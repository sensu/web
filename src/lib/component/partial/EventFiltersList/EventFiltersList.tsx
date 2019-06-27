import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "/vendor/@material-ui/core";

import { useSearchParams, useFilterParams } from "/lib/component/util";
import { ListController } from "/lib/component/controller";
import { Loader, TableListEmptyState } from "/lib/component/base";

import Pagination from "/lib/component/partial/Pagination";

import EventFiltersListHeader from "./EventFiltersListHeader";
import EventFiltersListItem from "./EventFiltersListItem";

export interface EventFiltersListVariables {
  limit: number;
  offset: number;
  order: string;
  filters: string[];
}

export const eventFiltersListFragments = {
  namespace: gql`
    fragment EventFiltersList_namespace on Namespace {
      eventFilters(
        limit: $limit
        offset: $offset
        orderBy: $order
        filters: $filters
      ) @connection(key: "eventFilters", filter: ["filters", "orderBy"]) {
        nodes {
          id
          name
          namespace
          action
        }

        pageInfo {
          ...Pagination_pageInfo
        }
      }
    }
    ${Pagination.fragments.pageInfo}
  `,
};

interface EventFilter {
  id: string;
  action: string;
  deleted: boolean;
  name: string;
  namespace: string;
}

interface PageInfo {
  totalCount: number;
}

interface Namespace {
  eventFilters: {
    pageInfo: PageInfo;
    nodes: EventFilter[];
  };
}

interface Props {
  editable: boolean;
  loading: boolean;
  limit?: number;
  namespace?: Namespace;
  offset?: number;
  order?: string;
}

const EventFiltersList = ({
  editable,
  loading,
  limit,
  namespace,
  offset,
  order,
}: Props) => {
  const [, setParams] = useSearchParams();
  const [filters, setFilters] = useFilterParams();

  const items: EventFilter[] = namespace
    ? namespace.eventFilters.nodes.filter((ef: EventFilter) => !ef.deleted)
    : [];

  return (
    <ListController
      items={items}
      getItemKey={(eventFilter: EventFilter) => eventFilter.id}
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
      renderItem={({ key, item: eventFilter }) => (
        <EventFiltersListItem key={key} eventFilter={eventFilter} />
      )}
    >
      {({ children }) => (
        <Paper>
          <Loader loading={loading}>
            <EventFiltersListHeader
              editable={editable}
              filters={filters}
              onChangeFilters={setFilters}
              order={order}
              rowCount={items.length}
            />

            <Table>
              <TableBody>{children}</TableBody>
            </Table>

            <Pagination
              limit={limit}
              offset={offset}
              pageInfo={namespace && namespace.eventFilters.pageInfo}
              onChangeQuery={(update: any) =>
                setParams((params) => ({ ...params, ...update }))
              }
            />
          </Loader>
        </Paper>
      )}
    </ListController>
  );
};

EventFiltersList.defaultProps = {
  editable: false,
  namespace: null,
  loading: false,
  limit: undefined,
  offset: undefined,
  filters: { action: "" },
};

export default EventFiltersList;
