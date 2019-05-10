import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { FailedError } from "/lib/error/FetchError";
import { pollingDuration } from "/lib/constant/polling";

import { MobileFullWidthContent, Content } from "/lib/component/base";

import {
  AppLayout,
  EventsList,
  EventsListToolbar,
  NotFound,
} from "/lib/component/partial";
import { Query, withQueryParams, WithWidth } from "/lib/component/util";
import { ToastConnector } from "/lib/component/relocation";

// If none given default expression is used.
const defaultExpression = "has_check";

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
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
    toolbarItems: undefined,
  };

  static query = gql`
    query EnvironmentViewEventsViewQuery(
      $namespace: String!
      $filter: String = "${defaultExpression}"
      $order: EventsListOrder
      $limit: Int,
      $offset: Int,
    ) {
      namespace(name: $namespace) {
        ...EventsList_namespace
      }
    }

    ${EventsList.fragments.namespace}
  `;

  render() {
    const { queryParams, match, setQueryParams, toolbarItems } = this.props;
    const { filter, limit, offset } = queryParams;
    const variables = { ...match.params, ...queryParams };

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
                    toolbarItems={toolbarItems}
                    onChangeQuery={value => setQueryParams({ filter: value })}
                    onClickReset={() =>
                      setQueryParams(q => q.reset(["filter", "order"]))
                    }
                    query={filter}
                  />
                </Content>
                <MobileFullWidthContent>
                  <ToastConnector>
                    {({ setToast }) => (
                      <WithWidth>
                        {({ width }) => (
                          <EventsList
                            setToast={setToast}
                            editable={width !== "xs"}
                            limit={limit}
                            offset={offset}
                            onChangeQuery={setQueryParams}
                            namespace={namespace}
                            loading={(loading && !namespace) || aborted}
                            refetch={refetch}
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
    order: "LASTOK",
  },
});
export default enhance(EventsView);
