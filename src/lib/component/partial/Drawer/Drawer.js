import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { withStyles } from "/vendor/@material-ui/core";

import FullDrawer from "./FullDrawer";
import QuickNav from "./QuickNav";

const styles = () => ({
  small: {
    width: "72px",
  },
});

class Drawer extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    namespace: PropTypes.object,
  };

  static defaultProps = {
    namespace: null,
  };

  state = { forced: false };

  static fragments = {
    namespace: gql`
      fragment Drawer_namespace on Namespace {
        ...FullDrawer_namespace
      }

      ${FullDrawer.fragments.namespace}
    `,
  };

  onToggle = () => {
    this.setState(state => ({ forced: !state.forced }));
  };

  onClose = () => {
    if (!this.state.forced) {
      return;
    }
    this.onToggle();
  };

  fullDrawer = () => {
    const { classes, loading, namespace, variant } = this.props;

    return (
      <FullDrawer
        open
        mobile={variant !== "large"}
        className={classes.large}
        loading={loading}
        namespace={namespace}
        onToggle={this.onToggle}
        onClose={this.onClose}
      />
    );
  };

  smallDrawer = () => {
    const { classes, loading, namespace, variant } = this.props;
    const { forced } = this.state;

    return (
      <React.Fragment>
        <FullDrawer
          mobile
          open={forced && variant !== "large"}
          className={classes.large}
          loading={loading}
          namespace={namespace}
          onToggle={this.onToggle}
          onClose={this.onClose}
        />
        <QuickNav
          open
          onToggle={this.onToggle}
          className={classes.small}
        />
      </React.Fragment>
    );
  };

  render() {
    const { variant } = this.props;
    const { forced } = this.state;

    // TODO this is lost on refresh
    // check if the user has set a preference
    if (!forced && variant === "large") {
      return this.fullDrawer();
    }
    return this.smallDrawer();
  }
}

export default withStyles(styles)(Drawer);
