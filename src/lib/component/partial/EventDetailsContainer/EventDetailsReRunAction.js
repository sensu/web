import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { compose } from "recompose";
import { withRouter } from "/vendor/react-router-dom";
import { withApollo } from "/vendor/react-apollo";

import executeCheck from "/lib/mutation/executeCheck";

import { ToastConnector } from "/lib/component/relocation";

import { ExecuteCheckStatusToast } from "/lib/component/toast";

class EventDetailsReRunAction extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
  };

  static fragments = {
    event: gql`
      fragment EventDetailsReRunAction_event on Event {
        check {
          nodeId
          proxyEntityName
        }
        entity {
          name
        }
        namespace
      }
    `,
  };

  render() {
    const { children, event, client } = this.props;

    // Unless this is a proxy entity target the specific entity
    let subscriptions = [`entity:${event.entity.name}`];
    if (event.check.proxyEntityName === event.entity.name) {
      subscriptions = [];
    }

    return (
      <ToastConnector>
        {({ addToast }) =>
          children(() => {
            const promise = executeCheck(client, {
              id: event.check.nodeId,
              subscriptions,
            });

            addToast(({ remove }) => (
              <ExecuteCheckStatusToast
                onClose={remove}
                mutation={promise}
                checkName={event.check.name}
                entityName={event.entity.name}
                namespace={event.namespace}
              />
            ));
          })
        }
      </ToastConnector>
    );
  }
}

const enhancer = compose(
  withApollo,
  withRouter,
);
export default enhancer(EventDetailsReRunAction);
