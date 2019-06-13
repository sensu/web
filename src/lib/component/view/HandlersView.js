import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { parseFilterParams, buildFilterParams } from "/lib/util/filterParams";
import { pollingDuration } from "/lib/constant/polling";
import { FailedError } from "/lib/error/FetchError";

import {
  Content,
  FilterList,
  MobileFullWidthContent,
} from "/lib/component/base";
import {
  AppLayout,
  HandlersList,
  HandlersListToolbar,
  NotFound,
} from "/lib/component/partial";

import { Query, withQueryParams } from "/lib/component/util";

class HandlersView extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    queryParams: PropTypes.shape({
      offset: PropTypes.string,
      limit: PropTypes.string,
    }).isRequired,
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
    query EnvironmentViewHandlersViewQuery(
      $namespace: String!
      $limit: Int
      $offset: Int
      $order: HandlerListOrder
      $filters: [String!]
    ) {
      namespace(name: $namespace) {
        ...HandlersList_namespace
      }
    }

    ${HandlersList.fragments.namespace}
  `;

  render() {
    const {
      match,
      queryParams,
      setQueryParams,
      toolbarItems,
      toolbarContent,
    } = this.props;
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
          query={HandlersView.query}
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
                  <HandlersListToolbar
                    onClickReset={() =>
                      setQueryParams(q => {
                        q.delete("filters");
                        q.delete("order");
                      })
                    }
                    toolbarContent={toolbarContent({
                      filters,
                      setFilters,
                    })}
                    toolbarItems={toolbarItems}
                  />
                </Content>

                <MobileFullWidthContent>
                  <HandlersList
                    editable={false}
                    limit={limit}
                    filters={filters}
                    offset={offset}
                    onChangeQuery={setQueryParams}
                    onChangeFilters={setFilters}
                    namespace={namespace}
                    loading={(loading && !namespace) || aborted}
                    refetch={refetch}
                    order={queryParams.order}
                  />
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
export default enhance(HandlersView);
