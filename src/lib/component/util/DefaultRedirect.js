import React from "/vendor/react";
import PropTypes from "prop-types";
import { graphql } from "/vendor/react-apollo";
import gql from "/vendor/graphql-tag";

import SigninRedirect from "./SigninRedirect";
import LastNamespaceRedirect from "./LastNamespaceRedirect";

const query = gql`
  query DefaultRedirectQuery {
    auth @client {
      accessToken
      invalid
    }
  }
`;

class DefaultRedirect extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    if (!this.props.data.auth.accessToken || this.props.data.auth.invalid) {
      return <SigninRedirect />;
    }
    return <LastNamespaceRedirect />;
  }
}

export default graphql(query)(DefaultRedirect);
