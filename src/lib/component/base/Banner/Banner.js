import React from "/vendor/react";
import PropTypes from "prop-types";
import classNames from "/vendor/classnames";

import { emphasize } from "/vendor/@material-ui/core/styles/colorManipulator";

import {
  withStyles,
  Paper,
  Typography,
  IconButton,
} from "/vendor/@material-ui/core";

import {
  CheckCircleIcon,
  ErrorIcon,
  InfoIcon,
  CloseIcon,
  WarningIcon,
} from "/lib/component/icon";

import uniqueId from "/lib/util/uniqueId";
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

  const successColor = theme.palette.success.main;
  const warnColor = theme.palette.warning.main;
  const infoColor = theme.palette.info.main;
  const errColor = theme.palette.error.main;

  return {
    root: {
      position: "relative",
      color: theme.palette.getContrastText(backgroundColor),
      backgroundColor,
      [theme.breakpoints.down("sm")]: {
        flexGrow: 1,
      },

      "&::before": {
        content: "''",
        display: "block",
        position: "absolute",
        height: 200,
        bottom: "100%",
        left: 0,
        right: 0,
        backgroundColor,
      },
    },

    content: {
      display: "flex",
      alignItems: "center",

      marginLeft: "auto",
      marginRight: "auto",

      maxWidth: 1224,

      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),

      [theme.breakpoints.up("md")]: {
        paddingLeft: 80,
        paddingRight: 80,
      },
    },

    message: {
      paddingTop: 14,
      paddingBottom: 14,
      display: "flex",
      alignItems: "center",

      [theme.breakpoints.down("md")]: {
        marginLeft: "env(safe-area-inset-left)",
      },

      "& strong": {
        fontWeight: 600,
      },
    },

    action: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 24,

      [theme.breakpoints.down("md")]: {
        marginRight: "env(safe-area-inset-right)",
      },
    },

    success: {
      color: theme.palette.getContrastText(successColor),
      backgroundColor: successColor,
      "&::before": {
        backgroundColor: successColor,
      },
    },
    error: {
      color: theme.palette.getContrastText(errColor),
      backgroundColor: errColor,
      "&::before": {
        backgroundColor: errColor,
      },
    },
    info: {
      color: theme.palette.getContrastText(infoColor),
      backgroundColor: infoColor,
      "&::before": {
        backgroundColor: infoColor,
      },
    },
    warning: {
      color: theme.palette.getContrastText(warnColor),
      backgroundColor: warnColor,
      "&::before": {
        backgroundColor: warnColor,
      },
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

class Banner extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.node,
    actions: PropTypes.node,
    variant: PropTypes.oneOf(Object.keys(icons)),
    onClose: PropTypes.func,
    maxAge: PropTypes.number,
    showAgeIndicator: PropTypes.bool,
  };

  static defaultProps = {
    maxAge: 0,
    variant: undefined,
    message: undefined,
    actions: undefined,
    showAgeIndicator: false,
    onClose: undefined,
  };

  state = { mouseOver: false };

  id = `Banner-${uniqueId()}`;

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
      actions,
      onClose,
      variant,
      maxAge,
      showAgeIndicator,
    } = this.props;

    const { mouseOver } = this.state;

    const Icon = icons[variant];

    const messageId = `${this.id}-message`;

    const closeButton = onClose ? (
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        className={classes.close}
        onClick={onClose}
      >
        <CloseIcon className={classes.icon} />
      </IconButton>
    ) : (
      undefined
    );

    return (
      <Paper
        headlinemapping={{
          body1: "div",
        }}
        role="alertdialog"
        square
        elevation={3}
        className={classNames(classes.root, classes[variant])}
        aria-describedby={messageId}
        onMouseOver={this._handleMouseOver}
        onMouseLeave={this._handleMouseLeave}
      >
        <div className={classes.content}>
          <Typography id={messageId} className={classes.message}>
            {Icon && <Icon className={classes.variantIcon} />}
            {message}
          </Typography>
          <div className={classes.action}>
            {actions}
            {!!maxAge && closeButton && (
              <Timer
                key={closeButton.props.key}
                delay={maxAge}
                onEnd={onClose}
                paused={mouseOver}
              >
                {showAgeIndicator
                  ? progress => (
                      <CircularProgress
                        width={4}
                        value={progress}
                        opacity={0.5}
                      >
                        {closeButton}
                      </CircularProgress>
                    )
                  : undefined}
              </Timer>
            )}
            {(!showAgeIndicator || !maxAge) && closeButton}
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(Banner);
