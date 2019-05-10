import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { withApollo } from "/vendor/react-apollo";

import setCheckPublish from "/lib/mutation/setCheckPublish";

import { usePublishCheckStatusToast } from "/lib/component/toast";

const CheckDetailsUnpublishAction = ({ children, client, check }) => {
  const createPublishCheckStatusToast = usePublishCheckStatusToast();

  return children(() => {
    const promise = setCheckPublish(client, {
      id: check.id,
      publish: false,
    });

    createPublishCheckStatusToast(promise, {
      checkName: check.name,
      publish: false,
    });
  });
};

CheckDetailsUnpublishAction.propTypes = {
  children: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  check: PropTypes.object.isRequired,
};

CheckDetailsUnpublishAction.fragments = {
  check: gql`
    fragment CheckDetailsPublishAction_check on CheckConfig {
      id
      name
      publish
    }
  `,
};

export default withApollo(CheckDetailsUnpublishAction);
