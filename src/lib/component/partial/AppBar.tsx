import React from "/vendor/react";
import {
  makeStyles,
  createStyles,
  AppBar as MUIAppBar,
  IconButton,
  Toolbar as MaterialToolbar,
  Typography,
  Theme,
} from "/vendor/@material-ui/core";

import { MenuIcon } from "/lib/component/icon";
import { SensuWordmark } from "/lib/component/base";
import UserAvatar from "./UserAvatar";

interface Props {
  // account id of the current authenticated user.
  accountId: string;

  // use flag if some required data is currently loading.
  loading?: boolean;

  // fired when the user clicks the menu button.
  onRequestMenu: () => void;

  // optional title label; if omitted Sensu wordmark is displayed.
  title?: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

const AppBar = ({ accountId, title, onRequestMenu }: Props) => {
  const classes = useStyles();

  return (
    <MUIAppBar position="static">
      <div className={classes.container}>
        <MaterialToolbar className={classes.toolbar}>
          <IconButton onClick={onRequestMenu} aria-label="Menu" color="inherit">
            <MenuIcon />
          </IconButton>

          <Typography
            className={classes.title}
            variant="h6"
            color="inherit"
            noWrap
          >
            {title || (
              <SensuWordmark alt="sensu logo" className={classes.logo} />
            )}
          </Typography>

          <div className={classes.grow} />

          {accountId && <UserAvatar username={accountId} />}
        </MaterialToolbar>
      </div>
    </MUIAppBar>
  );
};

export default React.memo(AppBar);
