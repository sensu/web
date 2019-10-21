import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles } from "/vendor/@material-ui/core";
import ResizeObserver from "/vendor/react-resize-observer";
import classnames from "/vendor/classnames";

import ToastWell from "/lib/component/relocation/ToastWell";
import BannerWell from "/lib/component/relocation/BannerWell";

import Context from "./Context";

const styles = theme => ({
  root: {
    paddingLeft: "env(safe-area-inset-left)",
    paddingRight: "env(safe-area-inset-right)",
  },

  mobile: {
    display: "block",
  },

  desktop: {
    display: "flex",
    alignItems: "stretch",
    flex: 1,
  },

  topBarContainer: {
    flex: 0,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,

    zIndex: 1,

    "@supports (position: sticky)": {
      position: "sticky",
    },
  },

  quickNavContainer: {
    position: "relative",
  },

  quickNav: {
    position: "absolute",
    flexDirection: "column",
    alignItems: "stretch",
    width: 72,
    display: "none",

    paddingTop: 12,

    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },

  topBar: {
    position: "relative",
    zIndex: 1,
  },

  banner: {
    position: "relative",
    zIndex: 0,
  },

  contentContainer: {
    flex: 1,
    display: "flex",
    zIndex: 0,
  },

  content: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",

    maxWidth: "100%",

    marginLeft: "auto",
    marginRight: "auto",

    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),

    paddingTop: 16,
    paddingBottom: 24,
  },

  contentMaxWidth: {
    maxWidth: 1224,
    [theme.breakpoints.up("md")]: {
      // align with quick nav container
      paddingTop: 24,
    },
  },

  toastContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 0,
  },

  toast: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,

    [theme.breakpoints.up("md")]: {
      left: "auto",
    },
  },
});

class AppLayout extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    mobile: PropTypes.bool,
    topBar: PropTypes.node,
    drawer: PropTypes.node,
    content: PropTypes.node,
    fullWidth: PropTypes.bool,
  };

  static defaultProps = {
    mobile: false,
    topBar: undefined,
    quickNav: undefined,
    content: undefined,
    fullWidth: false,
  };

  state = { topBarHeight: 0 };

  handleTopBarResize = rect => {
    this.setState(state => {
      if (state.topBarHeight === rect.height) {
        return null;
      }

      return { topBarHeight: rect.height };
    });
  };

  render() {
    const { classes, topBar, drawer, content, fullWidth } = this.props;

    const contentOffset =
      CSS && CSS.supports && CSS.supports("position: sticky")
        ? 0
        : this.state.topBarHeight;

    return (
      <Context.Provider value={this.state}>
        <div
          className={classnames(
            classes.root,
            !this.props.mobile ? classes.desktop : classes.mobile,
          )}
        >
          <div className={classes.topBarContainer}>
            {/* <ResizeObserver onResize={this.handleTopBarResize} /> */}
            <div className={classes.topBar}>{topBar}</div>
            <div className={classes.banner}>
              <BannerWell />
            </div>
          </div>
          {drawer}
          <div style={{ height: contentOffset }} />
          <div className={classes.contentContainer}>
            <div
              className={classnames(classes.content, {
                [classes.contentMaxWidth]: !fullWidth,
              })}
            >
              {content}
            </div>
          </div>
          <div className={classes.toastContainer}>
            <div className={classes.toast}>
              <ToastWell />
            </div>
          </div>
        </div>
      </Context.Provider>
    );
  }
}

export default withStyles(styles)(AppLayout);
