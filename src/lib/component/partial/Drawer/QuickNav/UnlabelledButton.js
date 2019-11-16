/* eslint-disable react/display-name */

import React, { forwardRef } from "/vendor/react";
import PropTypes from "prop-types";
import { NavLink } from "/vendor/react-router-dom";

import { withStyles, IconButton } from "/vendor/@material-ui/core";

const styles = theme => ({
  button: {
    color: theme.palette.text.secondary,
    width: 72,
    height: 72,
  },
});

const QuickNavUnlabelledButton = props => {
  const { classes, children, onClick } = props;
  const Link = forwardRef((props, ref) => (
    <NavLink {...props} innerRef={ref} />
  ));

  return (
    <IconButton
      classes={{
        root: classes.button,
      }}
      component={Link}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
};

QuickNavUnlabelledButton.displayName = "QuickNav.UnlabelledButton";
QuickNavUnlabelledButton.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(QuickNavUnlabelledButton);
