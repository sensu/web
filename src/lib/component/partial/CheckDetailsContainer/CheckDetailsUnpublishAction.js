import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { withApollo } from "/vendor/react-apollo";

import setCheckPublish from "/lib/mutation/setCheckPublish";

import { ToastConnector } from "/lib/component/relocation";

import { PublishCheckStatusToast } from "/lib/component/toast";

class CheckDetailsUnpublishAction extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    check: PropTypes.object.isRequired,
  };

  static fragments = {
    check: gql`
      fragment CheckDetailsPublishAction_check on CheckConfig {
        id
        name
        publish
      }
    `,
  };

  render() {
    const { children, client, check } = this.props;

    return (
      <ToastConnector>
        {({ setToast }) =>
          children(() => {
            const promise = setCheckPublish(client, {
              id: check.id,
              publish: false,
            });
            setToast(undefined, ({ remove }) => (
              <PublishCheckStatusToast
                onClose={remove}
                mutation={promise}
                checkName={check.name}
                publish={false}
              />
            ));
          })
        }
      </ToastConnector>
    );
  }
}

export default withApollo(CheckDetailsUnpublishAction);
