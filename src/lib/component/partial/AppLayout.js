import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { withStyles } from "/vendor/@material-ui/core";

import { FailedError } from "/lib/error/FetchError";

import { Query } from "/lib/component/util";
import { AppLayout as BaseAppLayout, Loader } from "/lib/component/base";

import Drawer from "/lib/component/partial/Drawer";
import AppBar from "/lib/component/partial/AppBar";

const styles = () => ({
  mobile: { display: "block" },
  desktop: { display: "flex" },
});

class AppLayout extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    namespace: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    fullWidth: false,
    children: undefined,
  };

  state = { showBar: false, fullDrawer: true };

  static query = gql`
    query AppLayoutQuery($namespace: String!) {
      namespace(name: $namespace) {
        ...AppBar_namespace
      }
    }

    ${AppBar.fragments.namespace}
  `;

  componentDidMount() {
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({
      showBar: window.innerWidth <= 400,
      fullDrawer: window.innerWidth >= 700,
    });
  }

  render() {
    const {
      classes,
      namespace: namespaceParam,
      fullWidth,
      children,
    } = this.props;

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
        {({ data = {}, loading, aborted }) => {
          return (
            <Loader loading={loading}>
              <BaseAppLayout
                fullWidth={fullWidth}
                mobile={this.state.showBar}
                topBar={
                  this.state.showBar && (
                    <AppBar
                      loading={loading || aborted}
                      namespace={data.namespace}
                    />
                  )
                }
                drawer={
                  !this.state.showBar && (
                    <Drawer
                      variant={this.state.fullDrawer ? "large" : "small"}
                      loading={loading}
                      namespace={data.namespace}
                    />
                  )
                }
                content={children}
              />
            </Loader>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(AppLayout);
