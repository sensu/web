import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { parseFilterParams, buildFilterParams } from "/lib/util/filterParams";
import { pollingDuration } from "/lib/constant/polling";
import { FailedError } from "/lib/error/FetchError";

import { Query, withQueryParams, WithWidth } from "/lib/component/util";
import {
  MobileFullWidthContent,
  Content,
  FilterList,
} from "/lib/component/base";
import {
  AppLayout,
  EventsList,
  EventsListToolbar,
  NotFound,
} from "/lib/component/partial";

class EventsView extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,

    // from withQueryParams HOC
    queryParams: PropTypes.shape({
      filter: PropTypes.string,
      order: PropTypes.string,
      offset: PropTypes.string,
      limit: PropTypes.string,
    }).isRequired,

    // from withQueryParams HOC
    setQueryParams: PropTypes.func.isRequired,

    toolbarContent: PropTypes.func,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
    toolbarContent: ({ filters, setFilters }) => (
      <FilterList filters={filters} onChange={setFilters} />
    ),
    toolbarItems: undefined,
  };

  static query = gql`
    query EnvironmentViewEventsViewQuery(
      $namespace: String!
      $filters: [String!]
      $order: EventsListOrder
      $limit: Int
      $offset: Int
    ) {
      namespace(name: $namespace) {
        ...EventsList_namespace
      }
    }

    ${EventsList.fragments.namespace}
  `;

  render() {
    const { queryParams, match, setQueryParams } = this.props;
    const { limit, offset } = queryParams;
    const variables = { ...match.params, ...queryParams };

    const filters = parseFilterParams(queryParams.filters);
    const setFilters = setter => {
      const next = setter(filters);
      setQueryParams({ filters: buildFilterParams(next) });
    };

    return (
      <AppLayout namespace={match.params.namespace}>
        <Query
          query={EventsView.query}
          fetchPolicy="cache-and-network"
          pollInterval={pollingDuration.short}
          variables={variables}
          onError={error => {
            if (error.networkError instanceof FailedError) {
              return;
            }

            throw error;
          }}
        >
          {({ data: { namespace } = {}, networkStatus, aborted, refetch }) => {
            // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
            const loading = networkStatus < 6;

            if (!namespace && !loading && !aborted) {
              return <NotFound />;
            }

            return (
              <div>
                <Content marginBottom>
                  <EventsListToolbar
                    onClickReset={() =>
                      setQueryParams(q => {
                        q.delete("filters");
                        q.delete("order");
                      })
                    }
                    toolbarContent={this.props.toolbarContent({
                      filters,
                      setFilters,
                    })}
                    toolbarItems={this.props.toolbarItems}
                  />
                </Content>
                <MobileFullWidthContent>
                  <WithWidth>
                    {({ width }) => (
                      <EventsList
                        editable={width !== "xs"}
                        limit={limit}
                        offset={offset}
                        filters={filters}
                        onChangeQuery={setQueryParams}
                        onChangeFilters={setFilters}
                        namespace={namespace}
                        loading={(loading && !namespace) || aborted}
                        refetch={refetch}
                      />
                    )}
                  </WithWidth>
                </MobileFullWidthContent>
              </div>
            );
          }}
        </Query>
      </AppLayout>
    );
  }
}

const enhance = withQueryParams({
  keys: ["filters", "order", "offset", "limit"],
  defaults: {
    limit: "25",
    offset: "0",
    order: "LASTOK",
  },
});
export default enhance(EventsView);
