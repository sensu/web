import React from "react";
import classnames from "classnames";
import { Box, Theme, makeStyles } from "/vendor/@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.action.hover,
    animation: "$animate 2s ease-in-out infinite",
    cursor: "progress",
    userSelect: "none",
  },
  text: {
    color: "transparent",
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: "100%",
  },
  "@keyframes animate": {
    "0%": {
      opacity: 1,
    },
    "50%": {
      opacity: theme.palette.type === "dark" ? 0.5 : 0.71,
    },
    "100%": {
      opacity: 1,
    },
  },
}));

interface Props {
  variant: "text" | "icon" | "box";
  children?: React.ReactElement | string;
}

const Skeleton = ({ variant = "box", children }: Props) => {
  const classes = useStyles();
  const className = classnames(classes.root, classes[variant]);

  if (variant === "text") {
    return (
      <Box className={className} clone>
        <span>{children}</span>
      </Box>
    );
  }

  return <Box className={className} />;
};

export default Skeleton;
