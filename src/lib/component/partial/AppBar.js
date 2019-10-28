import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import {
  withStyles,
  AppBar as MUIAppBar,
  Toolbar as MaterialToolbar,
  Typography,
  IconButton,
} from "/vendor/@material-ui/core";
import { MenuIcon } from "/lib/component/icon";

import { SensuWordmark } from "/lib/component/base";

import Drawer from "/lib/component/partial/Drawer";
import NamespaceLabel from "/lib/component/partial/NamespaceLabel";

class AppBar extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    viewer: PropTypes.object,
    namespace: PropTypes.object,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: false,
  };

  static defaultProps = { namespace: null, viewer: null };

  static fragments = {
    namespace: gql`
      fragment AppBar_namespace on Namespace {
        ...NamespaceLabel_namespace
        ...Drawer_namespace
      }

      ${NamespaceLabel.fragments.namespace}
      ${Drawer.fragments.namespace}
    `,
  };

  static styles = theme => ({
    container: {
      paddingTop: "env(safe-area-inset-top)",
      backgroundColor: theme.palette.primary.dark,
    },
    toolbar: {
      marginLeft: -12, // Account for button padding to match style guide.
      // marginRight: -12, // Label is not a button at this time.
      backgroundColor: theme.palette.primary.main,
    },
    title: {
      marginLeft: 20,
      flex: "0 1 auto",
    },
    grow: {
      flex: "1 1 auto",
    },
    logo: {
      height: 16,
      marginRight: theme.spacing(1),
      verticalAlign: "baseline",
    },
  });

  state = {
    drawerOpen: false,
  };

  handleToggleDrawer = () => {
    this.setState(state => ({ drawerOpen: !state.drawerOpen }));
  };

  render() {
    const { namespace, loading, classes } = this.props;

    // If we aren't in the context of a valid namespace and not currently
    // loading, default to having the having the drawer open so that the
    // context switcher is available.
    const drawerOpen = (
      this.state.drawerOpen
      || (!loading && namespace === null)
    );

    return (
      <React.Fragment>
        <MUIAppBar className={classes.appBar} position="static">
          <div className={classes.container}>
            <MaterialToolbar className={classes.toolbar}>
              <IconButton
                onClick={this.handleToggleDrawer}
                aria-label="Menu"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Typography
                className={classes.title}
                variant="h6"
                color="inherit"
                noWrap
              >
                <SensuWordmark alt="sensu logo" className={classes.logo} />
              </Typography>
              <div className={classes.grow} />
              {namespace && <NamespaceLabel namespace={namespace} />}
            </MaterialToolbar>
          </div>
        </MUIAppBar>
        <Drawer
          variant="large"
          loading={loading}
          open={drawerOpen}
          onToggle={this.handleToggleDrawer}
          mobile={true}
          namespace={namespace}
          className={classes.drawer}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(AppBar.styles)(AppBar);
