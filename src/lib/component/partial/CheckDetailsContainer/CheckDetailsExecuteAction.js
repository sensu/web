import gql from "/vendor/graphql-tag";
import { withRouter } from "/vendor/react-router-dom";
import { withApollo } from "/vendor/react-apollo";

import compose from "/lib/util/compose";

import executeCheck from "/lib/mutation/executeCheck";

import { useExecuteCheckStatusToast } from "/lib/component/toast";

const CheckDetailsExecuteAction = ({ children, client, check }) => {
  const createExecuteCheckStatusToast = useExecuteCheckStatusToast();

  return children(() => {
    const promise = executeCheck(client, {
      id: check.id,
    });

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

const enhancer = compose(
  withApollo,
  withRouter,
);
export default enhancer(CheckDetailsExecuteAction);
