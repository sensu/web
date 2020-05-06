import gql from "/vendor/graphql-tag";
import { useExecuteCheckStatusToast } from "/lib/component/toast";

const CheckDetailsExecuteAction = ({ children, check, onExecute }) => {
  const createExecuteCheckStatusToast = useExecuteCheckStatusToast();

  return children(() => {
    const { id, subscriptions, namespace } = check;
    const promise = onExecute({ id, subscriptions });

    createExecuteCheckStatusToast(promise, {
      checkName: check.name,
      namespace,
    });
  });
};

CheckDetailsExecuteAction.fragments = {
  check: gql`
    fragment CheckDetailsExecuteAction_check on CheckConfig {
      id
      name
      namespace
      subscriptions
    }
  `,
};

export default CheckDetailsExecuteAction;
