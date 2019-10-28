/* eslint-disable react/display-name */

import React, { forwardRef } from "/vendor/react";
import PropTypes from "prop-types";
import { NavLink } from "/vendor/react-router-dom";

import { withStyles, Typography, IconButton } from "/vendor/@material-ui/core";

const styles = theme => ({
  menuText: {
    color: "inherit",
    padding: "4px 0 0",
    fontSize: "0.6875rem",
  },
  active: {
    color: `${theme.palette.secondary.main} !important`,
    opacity: "1 !important",
  },
  link: {
    color: theme.palette.text.secondary,
  },
  label: {
    flexDirection: "column",
  },
  button: {
    width: 72,
    height: 72,
  },
});

const QuickNavButton = props => {
  const { classes, Icon, caption, to, exact } = props;
  const Link = forwardRef((props, ref) => (
    <NavLink {...props} innerRef={ref} />
  ));

  return (
    <IconButton
      classes={{
        root: classes.button,
        label: classes.label,
      }}
      className={classes.link}
      component={Link}
      to={to}
      activeClassName={classes.active}
      exact={exact}
    >
      <Icon />
      <Typography variant="caption" classes={{ root: classes.menuText }}>
        {caption}
      </Typography>
    </IconButton>
  );
};

QuickNavButton.displayName = "QuickNav.Button";
QuickNavButton.propTypes = {
  classes: PropTypes.object.isRequired,
  Icon: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

export default withStyles(styles)(QuickNavButton);
