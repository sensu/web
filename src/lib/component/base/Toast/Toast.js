import React from "/vendor/react";
import PropTypes from "prop-types";
import classNames from "/vendor/classnames";

import {
  withStyles,
  IconButton,
  Paper,
  Typography,
} from "/vendor/@material-ui/core";

import { emphasize } from "/vendor/@material-ui/core/styles/colorManipulator";

import uniqueId from "/lib/util/uniqueId";

import {
  CloseIcon,
  CheckCircleIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
} from "/lib/component/icon";

import { Timer } from "/lib/component/util";

import CircularProgress from "/lib/component/base/CircularProgress";

const icons = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

export const styles = theme => {
  const emphasis = theme.palette.type === "light" ? 0.8 : 0.98;
  const backgroundColor = emphasize(theme.palette.background.default, emphasis);

  return {
    /* Styles applied to the root element. */
    root: {
      position: "relative",
      overflow: "hidden",
      color: theme.palette.getContrastText(backgroundColor),
      backgroundColor,
      display: "flex",
      alignItems: "flex-start",
      [theme.breakpoints.up("md")]: {
        width: 400,
        borderRadius: theme.shape.borderRadius,
      },
      [theme.breakpoints.down("sm")]: {
        flexGrow: 1,
      },

      paddingTop: 4,
      transition: theme.transitions.create("padding"),
    },

    progressInset: {
      paddingTop: theme.spacing(1 / 2),
    },

    /* Styles applied to the progress wrapper element. */
    progress: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    },

    /* Styles applied to the message wrapper element. */
    message: {
      paddingTop: 14,
      paddingBottom: 14,
      paddingLeft: 24,

      display: "flex",
      alignItems: "flex-start",

      [theme.breakpoints.down("md")]: {
        marginLeft: "env(safe-area-inset-left)",
      },

      "& strong": {
        fontWeight: 600,
      },
    },
    /* Styles applied to the action wrapper element if `action` is provided. */
    action: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 24,
      paddingRight: 16,
      marginRight: -8,

      [theme.breakpoints.down("md")]: {
        marginRight: "env(safe-area-inset-right)",
      },
    },

    success: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.getContrastText(theme.palette.success.dark),
    },
    error: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.getContrastText(theme.palette.error.dark),
    },
    info: {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.getContrastText(theme.palette.info.main),
    },
    warning: {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.getContrastText(theme.palette.warning.dark),
    },
    icon: {
      fontSize: 20,
    },
    variantIcon: {
      opacity: 0.5,
      fontSize: 20,
      marginRight: theme.spacing(1),
    },
  };
};

class Toast extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.node,
    variant: PropTypes.oneOf(Object.keys(icons)),
    onClose: PropTypes.func.isRequired,
    maxAge: PropTypes.number,
    showAgeIndicator: PropTypes.bool,
    progress: PropTypes.node,
  };

  static defaultProps = {
    maxAge: 0,
    variant: undefined,
    message: undefined,
    progress: undefined,
    showAgeIndicator: false,
  };

  state = { mouseOver: false };

  id = `Toast-${uniqueId()}`;

  _handleMouseOver = () => {
    this.setState(state => {
      if (state.mouseOver) {
        return null;
      }

      return { mouseOver: true };
    });
  };

  _handleMouseLeave = () => {
    this.setState(state => {
      if (!state.mouseOver) {
        return null;
      }

      return { mouseOver: false };
    });
  };

  render() {
    const {
      classes,
      message,
      onClose,
      variant,
      maxAge,
      showAgeIndicator,
      progress: progressBar,
    } = this.props;

    const { mouseOver } = this.state;

    const Icon = icons[variant];

    const messageId = `${this.id}-message`;

    const closeButton = (
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        className={classes.close}
        onClick={onClose}
      >
        <CloseIcon className={classes.icon} />
      </IconButton>
    );

    return (
      <Paper
        component={Typography}
        headlineMapping={{
          body1: "div",
        }}
        role="alertdialog"
        square
        elevation={6}
        className={classNames(classes.root, classes[variant], {
          [classes.progressInset]: !!progressBar,
        })}
        aria-describedby={messageId}
        onMouseOver={this._handleMouseOver}
        onMouseLeave={this._handleMouseLeave}
      >
        <div className={classes.progress}>{progressBar}</div>
        <div id={messageId} className={classes.message}>
          {Icon && <Icon className={classes.variantIcon} />}
          {message}
        </div>
        <div className={classes.action}>
          {!!maxAge && (
            <Timer
              key={closeButton.props.key}
              delay={maxAge}
              onEnd={onClose}
              paused={mouseOver}
            >
              {showAgeIndicator
                ? progress => (
                    <CircularProgress width={4} value={progress} opacity={0.5}>
                      {closeButton}
                    </CircularProgress>
                  )
                : null}
            </Timer>
          )}
          {(!showAgeIndicator || !maxAge) && closeButton}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(Toast);
