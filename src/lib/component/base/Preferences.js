import React from "/vendor/react";
import PropTypes from "prop-types";
import { compose, withProps } from "recompose";
import gql from "/vendor/graphql-tag";
import { withApollo, graphql } from "/vendor/react-apollo";

import {
  AppBar,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  MenuList,
  Slide,
  Switch,
  Toolbar,
  Typography,
  withMobileDialog,
} from "/vendor/@material-ui/core";

import { BulbIcon, CloseIcon, EyeIcon } from "/lib/component/icon";

const SlideUp = withProps({ direction: "up" })(Slide);

const setThemeMutation = gql`
  mutation SetThemeMudation($theme: String!) {
    setTheme(theme: $theme) @client
  }
`;

const toggleDarkMutation = gql`
  mutation ToggleDarkMutation {
    toggleDark @client
  }
`;

class Preferences extends React.Component {
  static propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
  };

  state = {
    anchorEl: null,
  };

  handleToggle = () => {
    this.props.client.mutate({ mutation: toggleDarkMutation });
  };

  handleThemeSelect = theme => () => {
    this.props.client.mutate({
      mutation: setThemeMutation,
      variables: { theme },
    });

    this.setState({ anchorEl: null });
  };

  handleThemeClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleThemeClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { fullScreen, open, onClose, data } = this.props;
    const { anchorEl } = this.state;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={SlideUp}
        fullScreen={fullScreen}
        fullWidth
        PaperProps={{
          style: { minHeight: 400 },
        }}
      >
        <AppBar style={{ position: "relative" }}>
          <Toolbar>
            <IconButton color="inherit" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Preferences
            </Typography>
          </Toolbar>
        </AppBar>
        <List subheader={<ListSubheader>Appearance</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <BulbIcon />
            </ListItemIcon>
            <ListItemText
              primary="Lights Out"
              secondary="Switch to the dark theme..."
            />
            <ListItemSecondaryAction>
              <Switch onChange={this.handleToggle} checked={data.theme.dark} />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem button onClick={this.handleThemeClick}>
            <ListItemIcon>
              <EyeIcon />
            </ListItemIcon>
            <ListItemText primary="Theme" secondary={data.theme.theme} />
          </ListItem>
        </List>
        <Menu
          id="theme-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleThemeClose}
        >
          <MenuList>
            <MenuItem onClick={this.handleThemeSelect("sensu")}>
              <ListItem>
                <ListItemText primary="Default" secondary=" " />
              </ListItem>
            </MenuItem>
            <MenuItem onClick={this.handleThemeSelect("classic")}>
              <ListItem>
                <ListItemText
                  primary="Classic"
                  secondary="Vintage Sensu in apple green."
                />
              </ListItem>
            </MenuItem>
            <MenuItem onClick={this.handleThemeSelect("uchiwa")}>
              <ListItem>
                <ListItemText primary="Uchiwa" secondary="Cool in blue." />
              </ListItem>
            </MenuItem>
            <MenuItem onClick={this.handleThemeSelect("deuteranomaly")}>
              <ListItem>
                <ListItemText
                  primary="Deuteranomaly"
                  secondary="Colour blindess support for red-green."
                />
              </ListItem>
            </MenuItem>
            <MenuItem onClick={this.handleThemeSelect("tritanomaly")}>
              <ListItem>
                <ListItemText
                  primary="Tritanomaly"
                  secondary="Colour blindess support for blue-yellow."
                />
              </ListItem>
            </MenuItem>
          </MenuList>
        </Menu>
      </Dialog>
    );
  }
}

const enhancer = compose(
  withMobileDialog({ breakpoint: "xs" }),
  graphql(gql`
    query PreferencesQuery {
      theme @client {
        dark
        theme
      }
    }
  `),
  withApollo,
);
export default enhancer(Preferences);
