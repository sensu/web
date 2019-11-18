import gql from "/vendor/graphql-tag";
import { useExecuteCheckStatusToast } from "/lib/component/toast";

const CheckDetailsExecuteAction = ({ children, check, onExecute }) => {
  const createExecuteCheckStatusToast = useExecuteCheckStatusToast();

  return children(() => {
    const promise = onExecute({ id: check.id });

    createExecuteCheckStatusToast(promise, {
      checkName: check.name,
      namespace: check.namespace,
    });
  });
};

CheckDetailsExecuteAction.fragments = {
  check: gql`
    fragment CheckDetailsExecuteAction_check on CheckConfig {
      id
      name
      namespace
    }
  `,
};

export default CheckDetailsExecuteAction;
