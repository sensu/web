import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { pollingDuration } from "/lib/constant/polling";

import { FailedError } from "/lib/error/FetchError";

import { Query } from "/lib/component/util";

import {
  AppLayout,
  NotFound,
  HandlerDetailsContainer,
} from "/lib/component/partial";

const query = gql`
  query HandlerDetailsContentQuery($namespace: String!, $handler: String!) {
    handler(namespace: $namespace, name: $handler) {
      id
      ...HandlerDetailsContainer_handler
    }
  }

  ${HandlerDetailsContainer.fragments.handler}
`;

const HandlerDetailsView = ({ match, toolbarItems }) => (
  <AppLayout namespace={match.params.namespace}>
    <Query
      query={query}
      pollInterval={pollingDuration.short}
      fetchPolicy="cache-and-network"
      variables={match.params}
      onError={error => {
        if (error.networkError instanceof FailedError) {
          return;
        }

        throw error;
      }}
    >
      {({ aborted, client, data: { handler } = {}, networkStatus }) => {
        // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
        const loading = networkStatus < 6;

        if (!loading && !aborted && !handler) {
          return <NotFound />;
        }

        return (
          <HandlerDetailsContainer
            toolbarItems={toolbarItems}
            client={client}
            handler={handler}
            loading={loading || aborted}
          />
        );
      }}
    </Query>
  </AppLayout>
);

HandlerDetailsView.propTypes = {
  match: PropTypes.object.isRequired,
  toolbarItems: PropTypes.func,
};

HandlerDetailsView.defaultProps = {
  toolbarItems: undefined,
};

export default HandlerDetailsView;
