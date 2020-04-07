import React, { useCallback, useState } from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  AppBar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  MenuList,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "/vendor/@material-ui/core";

import {
  useApolloClient,
  useIdentity,
  usePreferredTheme,
} from "/lib/component/util";
import {
  BulbIcon,
  CloseIcon,
  EyeIcon,
  MoonIcon,
  LogoutIcon,
} from "/lib/component/icon";

import UserAvatar from "./UserAvatar";
import invalidateTokens from "/lib/mutation/invalidateTokens";

const setThemeMutation = gql`
  mutation SetThemeMudation($theme: String!) {
    setTheme(theme: $theme) @client
  }
`;

const setDarkModeMutation = gql`
  mutation ToggleDarkMutation($value: ThemeDarkModeValue!) {
    setDarkMode(value: $value) @client
  }
`;

const Preferences = ({ onClose }) => {
  const client = useApolloClient();
  const theme = usePreferredTheme();
  const identity = useIdentity();

  const onToggleDark = useCallback(
    () =>
      client.mutate({
        mutation: setDarkModeMutation,
        variables: { value: theme.dark ? "LIGHT" : "DARK" },
      }),
    [client, theme.dark],
  );
  const onToggleSysPref = useCallback(
    () =>
      client.mutate({
        mutation: setDarkModeMutation,
        variables: { value: theme.usingSystemColourScheme ? "LIGHT" : "UNSET" },
      }),
    [client, theme.usingSystemColourScheme],
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const onThemeClick = useCallback(ev => setAnchorEl(ev.currentTarget), [
    setAnchorEl,
  ]);
  const onThemeSelect = theme => () => {
    client.mutate({
      mutation: setThemeMutation,
      variables: { theme },
    });

    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Preferences
          </Typography>
          <Box flexGrow="1" />
          <IconButton
            color="inherit"
            edge="end"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem>
          <ListItemAvatar>
            <UserAvatar username={identity.sub} />
          </ListItemAvatar>
          <ListItemText
            primary={identity.sub}
            secondary={identity.groups.join(" · ")}
          />
          <ListItemSecondaryAction>
            <Tooltip title="Sign-out">
              <IconButton onClick={() => invalidateTokens(client)} edge="end">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>Brightness</ListSubheader>}>
        <ListItem>
          <ListItemIcon>
            <MoonIcon />
          </ListItemIcon>
          <ListItemText primary="Dark mode" />
          <ListItemSecondaryAction>
            <Switch edge="end" onChange={onToggleDark} checked={theme.dark} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BulbIcon />
          </ListItemIcon>
          <ListItemText
            primary="Use system settings"
            secondary="Set dark mode to use the light or dark selection located in your system settings."
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={onToggleSysPref}
              checked={theme.usingSystemColourScheme}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>Appearance</ListSubheader>}>
        <ListItem button onClick={onThemeClick}>
          <ListItemIcon>
            <EyeIcon />
          </ListItemIcon>
          <ListItemText primary="Theme" secondary={theme.value} />
        </ListItem>
      </List>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuList>
          <MenuItem
            selected={theme.value === "sensu"}
            onClick={onThemeSelect("sensu")}
          >
            <ListItem>
              <ListItemText primary="Sensu Go" />
            </ListItem>
          </MenuItem>
          <MenuItem
            selected={theme.value === "uchiwa"}
            onClick={onThemeSelect("uchiwa")}
          >
            <ListItem>
              <ListItemText primary="Uchiwa" />
            </ListItem>
          </MenuItem>
          <MenuItem
            selected={theme.value === "classic"}
            onClick={onThemeSelect("classic")}
          >
            <ListItem>
              <ListItemText primary="Classic" />
            </ListItem>
          </MenuItem>
          <MenuItem
            selected={theme.value === "deuteranopia"}
            onClick={onThemeSelect("deuteranopia")}
          >
            <ListItem>
              <ListItemText primary="Deuteranopia" />
            </ListItem>
          </MenuItem>
          <MenuItem
            selected={theme.value === "tritanopia"}
            onClick={onThemeSelect("tritanopia")}
          >
            <ListItem>
              <ListItemText primary="Tritanopia" />
            </ListItem>
          </MenuItem>
        </MenuList>
      </Menu>
    </React.Fragment>
  );
};

Preferences.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Preferences;
