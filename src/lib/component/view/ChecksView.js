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
  ChecksList,
  ChecksListToolbar,
  NotFound,
} from "/lib/component/partial";

class ChecksView extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,

    // from withQueryParams HOC
    queryParams: PropTypes.shape({
      offset: PropTypes.string,
      limit: PropTypes.string,
    }).isRequired,

    // from withQueryParams HOC
    setQueryParams: PropTypes.func.isRequired,

    toolbarItems: PropTypes.func,
    toolbarContent: PropTypes.func,
  };

  static defaultProps = {
    toolbarContent: ({ filters, setFilters }) => (
      <FilterList filters={filters} onChange={setFilters} />
    ),
    toolbarItems: undefined,
  };

  static query = gql`
    query EnvironmentViewChecksViewQuery(
      $namespace: String!
      $limit: Int
      $offset: Int
      $order: CheckListOrder
      $filters: [String!]
    ) {
      namespace(name: $namespace) {
        ...ChecksList_namespace
      }
    }

    ${ChecksList.fragments.namespace}
  `;

  render() {
    const { match, queryParams, setQueryParams } = this.props;
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
          query={ChecksView.query}
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
          {({ aborted, data: { namespace } = {}, networkStatus, refetch }) => {
            // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
            const loading = networkStatus < 6;

            if (!namespace && !loading && !aborted) {
              return <NotFound />;
            }

            return (
              <div>
                <Content marginBottom>
                  <ChecksListToolbar
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
                      <ChecksList
                        editable={width !== "xs"}
                        limit={limit}
                        offset={offset}
                        filters={filters}
                        onChangeQuery={setQueryParams}
                        onChangeFilters={setFilters}
                        namespace={namespace}
                        loading={(loading && !namespace) || aborted}
                        refetch={refetch}
                        order={queryParams.order}
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
    order: "NAME",
  },
});
export default enhance(ChecksView);
