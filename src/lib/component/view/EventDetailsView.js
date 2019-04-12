import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { FailedError } from "/lib/error/FetchError";

import { Query } from "/lib/component/util";

import {
  AppLayout,
  NotFound,
  EventDetailsContainer,
} from "/lib/component/partial";

import { pollingDuration } from "/lib/constant/polling";

const query = gql`
  query EventDetailsViewQuery(
    $namespace: String!
    $check: String!
    $entity: String!
  ) {
    event(namespace: $namespace, entity: $entity, check: $check) {
      deleted @client
      ...EventDetailsContainer_event
    }
  }

  ${EventDetailsContainer.fragments.event}
`;

class EventDetailsView extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  render() {
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
          {({ aborted, data: { event } = {}, networkStatus, refetch }) => {
            // see: https://github.com/apollographql/apollo-client/blob/master/packages/apollo-client/src/core/networkStatus.ts
            const loading = networkStatus < 6;

            if (!loading && !aborted && (!event || event.deleted)) {
              return <NotFound />;
            }

            return (
              <EventDetailsContainer
                event={event}
                loading={loading || !!aborted}
                refetch={refetch}
              />
            );
          }}
        </Query>
      </AppLayout>
    );
  }
}

export default EventDetailsView;
