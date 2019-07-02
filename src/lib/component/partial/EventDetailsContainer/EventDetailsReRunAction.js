import gql from "/vendor/graphql-tag";
import { withRouter } from "/vendor/react-router-dom";
import { withApollo } from "/vendor/react-apollo";

import compose from "/lib/util/compose";

import executeCheck from "/lib/mutation/executeCheck";

import { useExecuteCheckStatusToast } from "/lib/component/toast";

const EventDetailsReRunAction = ({ children, event, client }) => {
  // Unless this is a proxy entity target the specific entity
  let subscriptions = [`entity:${event.entity.name}`];
  if (event.check.proxyEntityName === event.entity.name) {
    subscriptions = [];
  }

  const createExecuteCheckStatusToast = useExecuteCheckStatusToast();

  const disableRunCheck =
    event.check.name === "keepalive" || subscriptions.length <= 0;

  const runCheck = () => {
    const promise = executeCheck(client, {
      id: event.check.nodeId,
      subscriptions,
    });

    createExecuteCheckStatusToast(promise, {
      checkName: event.check.name,
      entityName: event.entity.name,
      namespace: event.namespace,
    });
  };

  return children({ runCheck, canRunCheck: !disableRunCheck });
};

EventDetailsReRunAction.fragments = {
  event: gql`
    fragment EventDetailsReRunAction_event on Event {
      check {
        nodeId
        proxyEntityName
        name
      }
      entity {
        name
      }
      namespace
    }
  `,
};

const enhancer = compose(
  withApollo,
  withRouter,
);
export default enhancer(EventDetailsReRunAction);
