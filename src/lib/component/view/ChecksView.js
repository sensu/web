import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { pollingDuration } from "/lib/constant/polling";
import { FailedError } from "/lib/error/FetchError";

import { MobileFullWidthContent, Content } from "/lib/component/base";
import { Query, withQueryParams, WithWidth } from "/lib/component/util";
import { ToastConnector } from "/lib/component/relocation";
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
      $filter: String
    ) {
      namespace(name: $namespace) {
        ...ChecksList_namespace
      }
    }

    ${ChecksList.fragments.namespace}
  `;

  render() {
    const { match, queryParams, setQueryParams, toolbarItems } = this.props;
    const { limit, offset, filter } = queryParams;
    const variables = { ...match.params, ...queryParams };

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
                    query={filter}
                    onChangeQuery={value => setQueryParams({ filter: value })}
                    onClickReset={() =>
                      setQueryParams(q => q.reset(["filter", "order"]))
                    }
                  />
                </Content>

                <MobileFullWidthContent>
                  <ToastConnector>
                    {({ addToast }) => (
                      <WithWidth>
                        {({ width }) => (
                          <ChecksList
                            editable={width !== "xs"}
                            limit={limit}
                            offset={offset}
                            onChangeQuery={setQueryParams}
                            namespace={namespace}
                            loading={(loading && !namespace) || aborted}
                            refetch={refetch}
                            order={queryParams.order}
                            addToast={addToast}
                          />
                        )}
                      </WithWidth>
                    )}
                  </ToastConnector>
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
    order: "NAME",
  },
});
export default enhance(ChecksView);
