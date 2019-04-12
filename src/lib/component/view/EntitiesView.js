import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { FailedError } from "/lib/error/FetchError";
import { pollingDuration } from "/lib/constant/polling";

import { MobileFullWidthContent, Content } from "/lib/component/base";
import { Query, withQueryParams, WithWidth } from "/lib/component/util";

import {
  AppLayout,
  EntitiesList,
  EntitiesListToolbar,
  NotFound,
} from "/lib/component/partial";

class EntitiesView extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    queryParams: PropTypes.shape({
      filter: PropTypes.string,
      order: PropTypes.string,
      offset: PropTypes.string,
      limit: PropTypes.string,
    }).isRequired,
    setQueryParams: PropTypes.func.isRequired,
  };

  static query = gql`
    query EnvironmentViewEntitiesViewQuery(
      $namespace: String!
      $limit: Int
      $offset: Int
      $order: EntityListOrder
      $filter: String
    ) {
      namespace(name: $namespace) {
        ...EntitiesList_namespace
      }
    }

    ${EntitiesList.fragments.namespace}
  `;

  render() {
    const { queryParams, match, setQueryParams } = this.props;
    const { filter, limit, offset, order } = queryParams;
    const variables = { ...match.params, ...queryParams };

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
                    onChangeQuery={value => setQueryParams({ filter: value })}
                    onClickReset={() => setQueryParams(q => q.reset())}
                    query={filter}
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
  keys: ["filter", "order", "offset", "limit"],
  defaults: {
    limit: "25",
    offset: "0",
    order: "ID",
  },
});
export default enhance(EntitiesView);
