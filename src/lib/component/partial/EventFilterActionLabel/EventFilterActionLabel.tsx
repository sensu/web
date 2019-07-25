import React from "/vendor/react";
import classnames from "/vendor/classnames";
import {
  withStyles,
  Theme,
  StyleRulesCallback,
} from "/vendor/@material-ui/core";

interface Props {
  action: string;
  // From withStyles
  classes: any;
}

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    color: theme.palette.common.white,
    fontSize: "0.7rem",
    fontWeight: "bold",
    padding: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.main,
  },
  allow: {
    backgroundColor: theme.palette.secondary.main,
  },
  deny: {
    backgroundColor: theme.palette.error.main,
  },
});

const EventFilterActionLabel = ({ action, classes }: Props) => {
  const className = classnames(classes.root, {
    [classes.allow]: action === "ALLOW",
    [classes.deny]: action === "DENY",
  });

  return <span className={className}>{action}</span>;
};

export default withStyles(styles)(EventFilterActionLabel);
