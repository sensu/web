import React from "/vendor/react";
import PropTypes from "prop-types";
import { Link } from "/vendor/react-router-dom";
import gql from "/vendor/graphql-tag";
import { withApollo } from "/vendor/react-apollo";

import {
  withStyles,
  List,
  Divider,
  IconButton,
  Drawer as MaterialDrawer,
  Typography,
} from "/vendor/@material-ui/core";

import compose from "/lib/util/compose";

import invalidateTokens from "/lib/mutation/invalidateTokens";

import { Loader, Preferences, SensuWordmark } from "/lib/component/base";
import { WithNavigation } from "/lib/component/util";

import {
  FeedbackIcon,
  LogoutIcon,
  MenuIcon,
  WandIcon,
} from "/lib/component/icon";

import DrawerButton from "./DrawerButton";
import NamespaceIcon from "/lib/component/partial/NamespaceIcon";
import NamespaceSelector from "/lib/component/partial/NamespaceSelector";

const styles = theme => ({
  paper: {
    minWidth: 264,
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
  },
  headerContainer: {
    paddingTop: "env(safe-area-inset-top)",
    backgroundColor: theme.palette.primary.dark,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  logo: {
    height: 16,
    margin: "16px 16px 0 0",
  },
  namespaceSelector: {
    margin: "8px 0 0 0",
    width: "100%",
  },
  namespaceIcon: {
    margin: "24px 0 0 16px",
  },
  hamburgerButton: {
    color: theme.palette.primary.contrastText,
  },

  drawer: {
    width: "280px",
    display: "block",
  },
});

class FullDrawer extends React.Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    namespace: PropTypes.object,
    onToggle: PropTypes.func.isRequired,
    open: PropTypes.bool,
    mobile: PropTypes.bool,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    loading: false,
    open: true,
    mobile: false,
    viewer: null,
    namespace: null,
  };

  static fragments = {
    namespace: gql`
      fragment FullDrawer_namespace on Namespace {
        ...NamespaceIcon_namespace
      }

      ${NamespaceIcon.fragments.namespace}
    `,
  };

  state = {
    preferencesOpen: false,
  };

  collapse = () => {
    this.props.onToggle(false);
  };

  render() {
    const { client, loading, namespace, open, mobile, classes } = this.props;
    const { preferencesOpen } = this.state;

    return (
      <div className={classes.drawer}>
        <MaterialDrawer
          open={open}
          variant={mobile ? "temporary" : "permanent"}
          className={classes.drawer}
          onClose={this.collapse}
        >
          <Loader passhrough loading={loading}>
            <div className={classes.paper}>
              <div className={classes.headerContainer}>
                <div className={classes.header}>
                  <div className={classes.row}>
                    <IconButton
                      onClick={this.collapse}
                      className={classes.hamburgerButton}
                    >
                      <MenuIcon />
                    </IconButton>
                    <SensuWordmark
                      alt="sensu"
                      className={classes.logo}
                      color="secondary"
                    />
                  </div>
                  <div className={classes.row}>
                    <div className={classes.namespaceIcon}>
                      {namespace && (
                        <NamespaceIcon namespace={namespace} size={36} />
                      )}
                    </div>
                  </div>
                  <div className={classes.row}>
                    <NamespaceSelector
                      namespace={namespace}
                      className={classes.namespaceSelector}
                      onChange={this.collapse}
                    />
                  </div>
                </div>
              </div>
              <Divider />
              <WithNavigation>
                {links => (
                  <List>
                    {links.map(({ icon, caption, to }) => (
                      <DrawerButton
                        key={to}
                        Icon={icon}
                        primary={
                          <Typography color="textPrimary">{caption}</Typography>
                        }
                        component={Link}
                        onClick={this.collapse}
                        to={to}
                      />
                    ))}
                  </List>
                )}
              </WithNavigation>
              <Divider />
              <List>
                <DrawerButton
                  Icon={WandIcon}
                  primary="Preferences"
                  onClick={() => {
                    this.setState({ preferencesOpen: true });
                  }}
                />
                <DrawerButton
                  Icon={FeedbackIcon}
                  primary={
                    <Typography color="textPrimary">Feedback</Typography>
                  }
                  component="a"
                  href="https://github.com/sensu/sensu-go/issues"
                />
                <DrawerButton
                  Icon={LogoutIcon}
                  primary="Sign out"
                  onClick={() => {
                    this.collapse();
                    invalidateTokens(client);
                  }}
                />
              </List>
            </div>
          </Loader>
          <Preferences
            open={preferencesOpen}
            onClose={() => this.setState({ preferencesOpen: false })}
          />
        </MaterialDrawer>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withApollo,
)(FullDrawer);
