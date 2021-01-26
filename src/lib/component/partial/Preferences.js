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

import useUniqueId from "/lib/component/util/useUniqueId";
import invalidateTokens from "/lib/mutation/invalidateTokens";

import UserAvatar from "./UserAvatar";

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

const concatList = (list, { sep = " · ", max = 5 } = {}) => {
  const out = list
    .slice(0)
    .sort()
    .slice(0, max);
  if (list.length > out.length) {
    out.push(`and ${list.length - out.length} others`);
  }
  return out.join(sep);
};

const Preferences = ({ onClose }) => {
  const client = useApolloClient();
  const theme = usePreferredTheme();
  const identity = useIdentity();

  const darkModeLabelId = ":" + useUniqueId();
  const sysPrefLabelId = ":" + useUniqueId();

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
            secondary={concatList(identity.groups)}
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
          <ListItemText id={darkModeLabelId} primary="Dark mode" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={onToggleDark}
              checked={theme.dark}
              inputProps={{ "aria-labelledby": darkModeLabelId }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <BulbIcon />
          </ListItemIcon>
          <ListItemText
            id={sysPrefLabelId}
            primary="Use system settings"
            secondary="Set dark mode to use the light or dark selection located in your system settings."
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={onToggleSysPref}
              checked={theme.usingSystemColourScheme}
              inputProps={{
                "aria-labelledby": sysPrefLabelId,
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>Appearance</ListSubheader>}>
        <ListItem component="li" button onClick={onThemeClick}>
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
            <ListItemText primary="Sensu Go" />
          </MenuItem>
          <MenuItem
            selected={theme.value === "uchiwa"}
            onClick={onThemeSelect("uchiwa")}
          >
            <ListItemText primary="Uchiwa" />
          </MenuItem>
          <MenuItem
            selected={theme.value === "classic"}
            onClick={onThemeSelect("classic")}
          >
            <ListItemText primary="Classic" />
          </MenuItem>
          <MenuItem
            selected={theme.value === "highcontrast"}
            onClick={onThemeSelect("highcontrast")}
          >
            <ListItemText primary="High Contrast" />
          </MenuItem>

          <MenuItem
            selected={theme.value === "deuteranopia"}
            onClick={onThemeSelect("deuteranopia")}
          >
            <ListItemText primary="Deuteranopia" />
          </MenuItem>
          <MenuItem
            selected={theme.value === "tritanopia"}
            onClick={onThemeSelect("tritanopia")}
          >
            <ListItemText primary="Tritanopia" />
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
