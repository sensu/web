import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "/vendor/@material-ui/core";
import {
  darken,
  emphasize,
} from "/vendor/@material-ui/core/styles/colorManipulator";
import { parseLink } from "/lib/component/util";

const styles = theme => ({
  root: {
    color: emphasize(theme.palette.text.primary, 0.22),
    display: "inline",
    whiteSpace: "nowrap",
  },
  key: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    background: theme.palette.primary.main,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: `${theme.spacing(0.5)}px 0 0 ${theme.spacing(0.5)}px`,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  value: {
    color: darken(theme.palette.primary.main, 0.7),
    background: emphasize(theme.palette.primary.main, 0.7),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: `0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0`,
    border: `1px solid ${emphasize(theme.palette.primary.main, 0.7)}`,
  },
  icon: {
    paddingLeft: theme.spacing(0.3),
    verticalAlign: "middle",
    fontSize: "18px",
  },
});

class Label extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  render() {
    const { classes, name, value } = this.props;
    return (
      <Typography component="span" className={classes.root}>
        <span className={classes.key}>{name}</span>
        <span className={classes.value}>{parseLink(value)}</span>
      </Typography>
    );
  }
}

export default withStyles(styles)(Label);
