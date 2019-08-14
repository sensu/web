import React from "/vendor/react";
import classnames from "/vendor/classnames";
import { makeStyles, createStyles, Theme } from "/vendor/@material-ui/core";

interface Props {
  action: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

const EventFilterActionLabel = ({ action }: Props) => {
  const classes = useStyles();
  const className = classnames(classes.root, {
    [classes.allow]: action === "ALLOW",
    [classes.deny]: action === "DENY",
  });

  return <span className={className}>{action}</span>;
};

export default EventFilterActionLabel;
