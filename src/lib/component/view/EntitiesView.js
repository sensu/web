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
  EntitiesList,
  EntitiesListToolbar,
  NotFound,
} from "/lib/component/partial";

class EntitiesView extends React.PureComponent {
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
    query EnvironmentViewEntitiesViewQuery(
      $namespace: String!
      $limit: Int
      $offset: Int
      $order: EntityListOrder
      $filters: [String!]
    ) {
      namespace(name: $namespace) {
        ...EntitiesList_namespace
      }
    }

    ${EntitiesList.fragments.namespace}
  `;

  render() {
    const { queryParams, match, setQueryParams } = this.props;
    const { limit, offset, order } = queryParams;
    const variables = { ...match.params, ...queryParams };

    const filters = parseFilterParams(queryParams.filters);
    const setFilters = setter => {
      const next = setter(filters);
      setQueryParams({ filters: buildFilterParams(next) });
    };

    return (
      <AppLayout namespace={match.params.namespace}>
        <Query
          query={EntitiesView.query}
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
                  <EntitiesListToolbar
                    onClickReset={() =>
                      setQueryParams(q => q.reset(["filters", "order"]))
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
                      <EntitiesList
                        editable={width !== "xs"}
                        limit={limit}
                        offset={offset}
                        loading={(loading && !namespace) || aborted}
                        filters={filters}
                        onChangeFilters={setFilters}
                        onChangeQuery={setQueryParams}
                        namespace={namespace}
                        refetch={refetch}
                        order={order}
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
    order: "ID",
  },
});
export default enhance(EntitiesView);
