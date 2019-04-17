/* eslint-disable react/prop-types */
import React from "/vendor/react";

import {
  withStyles,
  Typography,
  Dialog,
  DialogContent as MuiDialogContent,
  DialogTitle,
  DialogActions as MuiDialogActions,
} from "/vendor/@material-ui/core";

import { ErrorIcon } from "/lib/component/icon";
import { useBuildInfo, createStyledComponent } from "/lib/component/util";

const Title = withStyles(theme => ({
  root: {
    background: theme.palette.error.main,
    display: "flex",
    alignItems: "center",
    color: theme.palette.error.contrastText,
  },
}))(props => <DialogTitle {...props} disableTypography />);

const Icon = withStyles(theme => ({
  root: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.unit * 2,
  },
}))(ErrorIcon);

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

const BuildInfo = createStyledComponent({
  styles: theme => ({
    position: "absolute",
    bottom: theme.spacing.unit,
    left: theme.spacing.unit,
  }),
});

const ErrorDialog = ({
  children,
  actions,
  title = "Something went wrong",
  ...props
}) => {
  const { webRevision, sensuVersion } = useBuildInfo();

  return (
    <Dialog {...props}>
      <Title>
        <Icon />
        <Typography variant="h6" color="inherit">
          {title}
        </Typography>
      </Title>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
      <BuildInfo>
        <Typography variant="caption">
          {sensuVersion && `Sensu version ${sensuVersion}`}
          {sensuVersion && <br />}
          web revision {webRevision}
        </Typography>
      </BuildInfo>
    </Dialog>
  );
};

export default React.memo(ErrorDialog);
