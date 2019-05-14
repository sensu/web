import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { withApollo } from "/vendor/react-apollo";

import setCheckPublish from "/lib/mutation/setCheckPublish";

import { usePublishCheckStatusToast } from "/lib/component/toast";

const CheckDetailsPublishAction = ({ children, client, check }) => {
  const createPublishCheckStatusToast = usePublishCheckStatusToast();

  return children(() => {
    const promise = setCheckPublish(client, {
      id: check.id,
      publish: true,
    });

    createPublishCheckStatusToast(promise, {
      checkName: check.name,
    });
  });
};

CheckDetailsPublishAction.propTypes = {
  children: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  check: PropTypes.object.isRequired,
};

CheckDetailsPublishAction.fragments = {
  check: gql`
    fragment CheckDetailsPublishAction_check on CheckConfig {
      id
      name
      publish
    }
  `,
};

export default withApollo(CheckDetailsPublishAction);
