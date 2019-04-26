import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { pollingDuration } from "/lib/constant/polling";
import { FailedError } from "/lib/error/FetchError";
import { Query } from "/lib/component/util";
import { Loader } from "/lib/component/base";

import {
  AppLayout,
  EntityDetailsContainer,
  NotFound,
} from "/lib/component/partial";

const query = gql`
  query EntityDetailsViewQuery($namespace: String!, $entity: String!) {
    entity(namespace: $namespace, name: $entity) {
      id
      deleted @client
      ...EntityDetailsContainer_entity
    }
  }

  ${EntityDetailsContainer.fragments.entity}
`;

class EntityDetailsView extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
    toolbarItems: undefined,
  };

  render() {
    const { toolbarItems } = this.props;
    return (
      <AppLayout namespace={this.props.match.params.namespace}>
        <Query
          query={query}
          fetchPolicy="cache-and-network"
          pollInterval={pollingDuration.short}
          variables={this.props.match.params}
          onError={error => {
            if (error.networkError instanceof FailedError) {
              return;
            }

            throw error;
          }}
        >
          {({ data: { entity } = {}, networkStatus, aborted, refetch }) => {
            // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
            const loading = networkStatus < 6;

            if (!loading && !aborted && (!entity || entity.deleted)) {
              return <NotFound />;
            }

            return (
              <Loader loading={loading || aborted} passthrough>
                {entity && (
                  <EntityDetailsContainer
                    toolbarItems={toolbarItems}
                    entity={entity}
                    refetch={refetch}
                  />
                )}
              </Loader>
            );
          }}
        </Query>
      </AppLayout>
    );
  }
}

export default EntityDetailsView;
