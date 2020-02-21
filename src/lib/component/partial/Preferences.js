import React, { useCallback, useState } from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  AppBar,
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
  Switch,
  Toolbar,
  Typography,
} from "/vendor/@material-ui/core";
import { BulbIcon, CloseIcon, EyeIcon } from "/lib/component/icon";

import {
  useApolloClient,
  useSystemColorSchemePreference,
  useQuery,
} from "/lib/component/util";

const query = gql`
  query PreferencesQuery {
    theme @client {
      value
      dark
    }
  }
`;

const setThemeMutation = gql`
  mutation SetThemeMudation($theme: String!) {
    setTheme(theme: $theme) @client
  }
`;

const setDarkModeMutation = gql`
  mutation ToggleDarkMutation($value: Boolean!) {
    enableDarkMode(value: $value) @client
  }
`;

const Preferences = ({ onClose }) => {
  const client = useApolloClient();
  const { data } = useQuery({ query });

  const sysPref = useSystemColorSchemePreference();
  const dark =
    data.theme.dark !== "UNSET" ? data.theme.dark === "DARK" : sysPref;
  const theme = data.theme.value;

  const onToggleDark = useCallback(
    () =>
      client.mutate({
        mutation: setDarkModeMutation,
        variables: { value: !dark },
      }),
    [client, dark],
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
            <Switch onChange={onToggleDark} checked={dark} />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button onClick={onThemeClick}>
          <ListItemIcon>
            <EyeIcon />
          </ListItemIcon>
          <ListItemText primary="Theme" secondary={data.theme.value} />
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
            selected={theme === "sensu"}
            onClick={onThemeSelect("sensu")}
          >
            <ListItem>
              <ListItemText primary="Default" secondary="modern look" />
            </ListItem>
          </MenuItem>
          <MenuItem
            selected={theme === "classic"}
            onClick={onThemeSelect("classic")}
          >
            <ListItem>
              <ListItemText primary="Classic" secondary="vintage apple green" />
            </ListItem>
          </MenuItem>
          <MenuItem
            selected={theme === "uchiwa"}
            onClick={onThemeSelect("uchiwa")}
          >
            <ListItem>
              <ListItemText primary="Uchiwa" secondary="cool blue" />
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
