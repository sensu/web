import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { compose } from "recompose";
import { withRouter } from "/vendor/react-router-dom";
import { withApollo } from "/vendor/react-apollo";

import executeCheck from "/lib/mutation/executeCheck";

import { ToastConnector } from "/lib/component/relocation";

import { ExecuteCheckStatusToast } from "/lib/component/toast";

class CheckDetailsExecuteAction extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
  };

  static fragments = {
    check: gql`
      fragment CheckDetailsExecuteAction_check on CheckConfig {
        id
        name
        namespace
      }
    `,
  };

  render() {
    const { children, client, check } = this.props;

    return (
      <ToastConnector>
        {({ addToast }) =>
          children(() => {
            const promise = executeCheck(client, {
              id: check.id,
            });

            addToast(({ remove }) => (
              <ExecuteCheckStatusToast
                onClose={remove}
                mutation={promise}
                checkName={check.name}
                namespace={check.namespace}
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
export default enhancer(CheckDetailsExecuteAction);
