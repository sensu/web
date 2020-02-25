import React from "/vendor/react";
import PropTypes from "prop-types";
import classnames from "/vendor/classnames";

import { withStyles, SvgIcon, Tooltip } from "/vendor/@material-ui/core";

import { statusCodeToId } from "/lib/util/checkStatus";

import {
  ErrorIcon,
  ErrorHollowIcon,
  OKIcon,
  SmallCheckIcon,
  WarnIcon,
  WarnHollowIcon,
  UnknownIcon,
  SilenceIcon,
} from "/lib/component/icon";

const styles = theme => ({
  inline: {
    fontSize: "inherit",
    verticalAlign: "middle",
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  critical: {
    color: theme.palette.critical.main,
  },
  unknown: {
    color: theme.palette.unknown.main,
  },
  muted: {
    color: theme.palette.grey[500],
  },
  silenced: {
    opacity: 0.35,
  },
  silenceIcon: {
    opacity: 0.71,
  },
});

const componentMap = {
  normal: {
    success: OKIcon,
    warning: WarnIcon,
    critical: ErrorIcon,
    unknown: UnknownIcon,
  },
  small: {
    success: SmallCheckIcon,
    warning: WarnHollowIcon,
    critical: ErrorHollowIcon,
    unknown: ErrorHollowIcon,
  },
};

class Icon extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    mutedOK: PropTypes.bool,
    small: PropTypes.bool,
    statusCode: PropTypes.number.isRequired,
    inline: PropTypes.bool,
    silenced: PropTypes.bool,
  };

  static defaultProps = {
    className: "",
    inline: false,
    mutedOK: false,
    small: false,
    silenced: false,
  };

  render() {
    const {
      classes,
      className: classNameProp,
      inline,
      mutedOK,
      small,
      statusCode,
      silenced,

      ...props
    } = this.props;

    const status = statusCodeToId(statusCode);
    const Component = componentMap[!small ? "normal" : "small"][status];
    const className = classnames(classNameProp, classes[status], {
      [classes.muted]: status === "success" && mutedOK,
      [classes.inline]: inline,
      [classes.silenced]: silenced && !small,
    });

    const title = silenced ? "silenced" : status;
    const icon = <Component className={className} {...props} />;
    if (silenced) {
      if (small) {
        return (
          <Tooltip title={title}>
            <SilenceIcon className={className} />
          </Tooltip>
        );
      }
      return (
        <Tooltip title={title}>
          <SvgIcon viewBox="0 0 24 24">
            <SilenceIcon
              x={12}
              y={12}
              width={12}
              height={12}
              className={classes.silencedIcon}
            />
            {React.cloneElement(icon, {
              x: 0,
              y: 0,
              width: 24,
              height: 24,
              withGap: true,
            })}
          </SvgIcon>
        </Tooltip>
      );
    }

    return <Tooltip title={title}>{icon}</Tooltip>;
  }
}

export default withStyles(styles)(Icon);
