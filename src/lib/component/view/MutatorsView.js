import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { PollingDuration } from "/lib/constant";
import { FailedError } from "/lib/error/FetchError";

import { Content, MobileFullWidthContent } from "/lib/component/base";
import {
  AppLayout,
  MutatorsList,
  MutatorsListToolbar,
  NotFound,
} from "/lib/component/partial";

import { Query, withQueryParams } from "/lib/component/util";

class MutatorsView extends React.Component {
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
    toolbarContent: undefined,
    toolbarItems: undefined,
  };

  static query = gql`
    query EnvironmentViewMutatorsViewQuery(
      $namespace: String!
      $limit: Int
      $offset: Int
      $order: MutatorListOrder
      $filters: [String!]
    ) {
      namespace(name: $namespace) {
        ...MutatorsList_namespace
      }
    }

    ${MutatorsList.fragments.namespace}
  `;

  render() {
    const { match, queryParams, setQueryParams, toolbarItems } = this.props;
    const { limit, offset } = queryParams;
    const variables = { ...match.params, ...queryParams };

    return (
      <AppLayout namespace={match.params.namespace}>
        <Query
          query={MutatorsView.query}
          fetchPolicy="cache-and-network"
          pollInterval={PollingDuration.short}
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
                  <MutatorsListToolbar
                    onClickReset={() =>
                      setQueryParams(q => {
                        q.delete("order");
                      })
                    }
                    toolbarItems={toolbarItems}
                  />
                </Content>

                <MobileFullWidthContent>
                  <MutatorsList
                    editable={false}
                    limit={limit}
                    offset={offset}
                    onChangeQuery={setQueryParams}
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
export default enhance(MutatorsView);
