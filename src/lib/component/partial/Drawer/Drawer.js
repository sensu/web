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
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    namespace: PropTypes.object.isRequired,
  };

  static fragments = {
    namespace: gql`
      fragment Drawer_namespace on Namespace {
        ...FullDrawer_namespace
      }

      ${FullDrawer.fragments.namespace}
    `,
  };

  render() {
    const { classes, variant, loading, open, onToggle, namespace } = this.props;

    return variant === "large" ? (
      <FullDrawer
        className={classes.large}
        loading={loading}
        open={open}
        onToggle={onToggle}
        namespace={namespace}
      />
    ) : (
      <QuickNav className={classes.small} />
    );
  }
}
export default withStyles(styles)(Drawer);
