import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import { FailedError } from "/lib/error/FetchError";

import { Query } from "/lib/component/util";
import { AppLayout as BaseAppLayout, Loader } from "/lib/component/base";

import QuickNav from "/lib/component/partial/QuickNav";
import AppBar from "/lib/component/partial/AppBar";

class AppLayout extends React.PureComponent {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    fullWidth: false,
    children: undefined,
  };

  static query = gql`
    query AppLayoutQuery($namespace: String!) {
      viewer {
        ...AppBar_viewer
      }

      namespace(name: $namespace) {
        ...AppBar_namespace
      }
    }

    ${AppBar.fragments.viewer}
    ${AppBar.fragments.namespace}
  `;

  render() {
    const { namespace: namespaceParam, fullWidth, children } = this.props;

    return (
      <Query
        query={AppLayout.query}
        variables={{ namespace: namespaceParam }}
        onError={error => {
          if (error.networkError instanceof FailedError) {
            return;
          }

          throw error;
        }}
      >
        {({ data = {}, loading, aborted }) => (
          <Loader loading={loading}>
            <BaseAppLayout
              fullWidth={fullWidth}
              topBar={
                <AppBar
                  loading={loading || aborted}
                  namespace={data.namespace}
                  viewer={data.viewer}
                />
              }
              quickNav={
                <QuickNav
                  namespace={data.namespace ? data.namespace.name : undefined}
                />
              }
              content={children}
            />
          </Loader>
        )}
      </Query>
    );
  }
}

export default AppLayout;
