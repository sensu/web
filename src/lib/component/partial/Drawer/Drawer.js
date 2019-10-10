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
    namespace: PropTypes.object.isRequired,
  };

  state = { forceExpand: null };

  static fragments = {
    namespace: gql`
      fragment Drawer_namespace on Namespace {
        ...FullDrawer_namespace
      }

      ${FullDrawer.fragments.namespace}
    `,
  };

  onToggle = value => {
    this.setState({ forceExpand: value });
  };

  fullDrawer = () => {
    return (
      <FullDrawer
        className={this.props.classes.large}
        loading={this.props.loading}
        namespace={this.props.namespace}
        onToggle={this.onToggle}
      />
    );
  };

  smallDrawer = () => {
    return (
      <QuickNav onToggle={this.onToggle} className={this.props.classes.small} />
    );
  };

  render() {
    const { variant } = this.props;

    // check if the user has set a preference
    // TODO this is lost on refresh
    if (this.state.forceExpand === true) {
      return this.fullDrawer();
    }
    if (this.state.forceExpand === false) {
      return this.smallDrawer();
    }

    // return a drawer depending on resolution
    if (variant === "large") {
      return this.fullDrawer();
    } else {
      return this.smallDrawer();
    }
  }
}
export default withStyles(styles)(Drawer);
