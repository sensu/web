import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "/vendor/@material-ui/core";
import {
  darken,
  emphasize,
} from "/vendor/@material-ui/core/styles/colorManipulator";
import classNames from "/vendor/classnames";
import { AutoLink } from "/lib/component/util";

const styles = theme => ({
  root: {
    color: emphasize(theme.palette.text.primary, 0.22),
    display: "inline",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  base: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: "inline-block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    height: "22px",
  },
  key: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    background: theme.palette.primary.main,
    borderRadius: `${theme.spacing(0.5)}px 0 0 ${theme.spacing(0.5)}px`,
    border: `1px solid ${theme.palette.primary.main}`,
    maxWidth: "160px",
  },
  singleKey: {
    borderRadius: `${theme.spacing(0.5)}px`,
  },
  value: {
    color: darken(theme.palette.primary.main, 0.7),
    background: emphasize(theme.palette.primary.main, 0.7),
    borderRadius: `0 ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0`,
    border: `1px solid ${emphasize(theme.palette.primary.main, 0.7)}`,
    maxWidth: "200px",
  },
});

class KeyValueChip extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: null,
  };

  render() {
    const { classes, name, value, ...props } = this.props;
    return (
      <Typography component="span" className={classes.root} variant="body2">
        <span
          className={classNames(
            classes.base,
            classes.key,
            value ? null : classes.singleKey,
          )}
          {...props}
        >
          {name}
        </span>
        {value && (
          <span className={classNames(classes.base, classes.value)}>
            <AutoLink value={value} {...props} />
          </span>
        )}
      </Typography>
    );
  }
}

export default withStyles(styles)(KeyValueChip);
