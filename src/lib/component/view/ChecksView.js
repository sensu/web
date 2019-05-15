import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { parseFilterParams, buildFilterParams } from "/lib/util/filterParams";
import { pollingDuration } from "/lib/constant/polling";
import { FailedError } from "/lib/error/FetchError";

import { MobileFullWidthContent, Content } from "/lib/component/base";
import { Query, withQueryParams, WithWidth } from "/lib/component/util";
import {
  AppLayout,
  ChecksList,
  ChecksListToolbar,
  NotFound,
} from "/lib/component/partial";

class ChecksView extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    queryParams: PropTypes.shape({
      offset: PropTypes.string,
      limit: PropTypes.string,
    }).isRequired,
    setQueryParams: PropTypes.func.isRequired,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
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
    const { match, queryParams, setQueryParams, toolbarItems } = this.props;
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
                    toolbarItems={toolbarItems}
                    onClickReset={() =>
                      setQueryParams(q => q.reset(["filters", "order"]))
                    }
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
