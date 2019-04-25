import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { FailedError } from "/lib/error/FetchError";
import { pollingDuration } from "/lib/constant/polling";

import { Content, MobileFullWidthContent } from "/lib/component/base";
import { Query, withQueryParams, WithWidth } from "/lib/component/util";

import {
  AppLayout,
  NotFound,
  SilencesList,
  SilencesListToolbar,
  SilenceEntryDialog,
} from "/lib/component/partial";

const WithDialogState = ({ children }) => {
  const [isOpen, setOpen] = React.useState(false);

  return children({
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
  });
};

class SilencesView extends React.Component {
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
    query EnvironmentViewSilencesViewQuery(
      $namespace: String!
      $limit: Int
      $offset: Int
      $order: SilencesListOrder
      $filter: String
    ) {
      namespace(name: $namespace) {
        ...SilencesList_namespace
      }
    }

    ${SilencesList.fragments.namespace}
  `;

  render() {
    const { match, queryParams, setQueryParams, toolbarItems } = this.props;
    const { filter, limit, offset, order } = queryParams;
    const variables = { ...match.params, ...queryParams };

    return (
      <AppLayout namespace={match.params.namespace}>
        <Query
          query={SilencesView.query}
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
                <WithDialogState>
                  {newDialog => (
                    <React.Fragment>
                      <Content marginBottom>
                        <SilencesListToolbar
                          toolbarItems={toolbarItems}
                          filter={filter}
                          onChangeQuery={val => setQueryParams({ filter: val })}
                          onClickCreate={newDialog.open}
                          onClickReset={() =>
                            setQueryParams(q => q.reset(["filter", "offset"]))
                          }
                        />
                      </Content>

                      {newDialog.isOpen && (
                        <SilenceEntryDialog
                          values={{
                            namespace: match.params.namespace,
                            props: {},
                          }}
                          onClose={() => {
                            // TODO: Only refetch / poison list on success
                            refetch();
                            newDialog.close();
                          }}
                        />
                      )}
                    </React.Fragment>
                  )}
                </WithDialogState>

                <MobileFullWidthContent>
                  <WithWidth>
                    {({ width }) => (
                      <SilencesList
                        editable={width !== "xs"}
                        limit={limit}
                        offset={offset}
                        order={order}
                        onChangeQuery={setQueryParams}
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
  keys: ["filter", "order", "offset", "limit"],
  defaults: {
    limit: "25",
    offset: "0",
    order: "ID",
  },
});
export default enhance(SilencesView);
