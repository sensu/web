import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "/vendor/@material-ui/core";

const styles = theme => ({
  root: {
    paddingTop: "32px",
    maxWidth: "950px",
  },
  text: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

class Breadcrumbs extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };
  render() {
    console.log(window.location);
    const location = window.location.href;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography className={classes.text} variant="body1">
          {window.location.href}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Breadcrumbs);
