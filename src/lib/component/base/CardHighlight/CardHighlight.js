import React from "/vendor/react";
import PropTypes from "prop-types";
import classnames from "/vendor/classnames";
import { withStyles } from "/vendor/@material-ui/core";

const styles = theme => ({
  root: {
    height: 2,
    flexShrink: 0,
    border: "none",
    margin: "0 0 -2px 0",
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  critical: {
    backgroundColor: theme.palette.critical.main,
  },
  unknown: {
    backgroundColor: theme.palette.unknown.main,
  },
});

class CardHighlight extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "success",
      "warning",
      "critical",
      "unknown",
    ]).isRequired,
  };

  render() {
    const { classes, color } = this.props;
    const className = classnames(classes.root, classes[color]);

    return <hr className={className} />;
  }
}

export default withStyles(styles)(CardHighlight);
