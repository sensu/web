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
    flexDirection: "column",
  },

  mobile: {
    display: "block",
  },

  crumbs: {
    display: "flex",
    height: 56,
    alignItems: "center",
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

    display: "flex",
    flexDirection: "column",
    zIndex: 1,

    "@supports (position: sticky)": {
      position: "sticky",
    },
  },

  topBar: {
    position: "relative",
    zIndex: 1,
  },

  banner: {
    width: "100%",
    zIndex: 0,
  },

  cols: {
    flex: 1,
    display: "flex",
    zIndex: 0,
    flexDirection: "row",
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
    paddingTop: theme.spacing(2),

    [theme.breakpoints.up("sm")]: {
      paddingTop: 0,
    },
  },

  contentContainer: {
    paddingBottom: 24,
  },

  contentMaxWidth: {
    maxWidth: 1224,
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
    crumbs: PropTypes.node,
    mobile: PropTypes.bool,
    topBar: PropTypes.node,
    drawer: PropTypes.node,
    content: PropTypes.node,
    fullWidth: PropTypes.bool,
  };

  static defaultProps = {
    content: undefined,
    fullWidth: false,
    mobile: false,
    quickNav: undefined,
    topBar: undefined,
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
            <ResizeObserver onResize={this.handleTopBarResize} />
            <div className={classes.topBar}>{topBar}</div>
            <div className={classes.banner}>
              <BannerWell />
            </div>
          </div>
          {this.props.mobile && <div style={{ height: contentOffset }} />}
          <div className={classes.cols}>
            {drawer}
            <div
              className={classnames(classes.content, {
                [classes.contentMaxWidth]: !fullWidth,
              })}
            >
              {this.props.crumbs && (
                <div className={classes.crumbs}>{this.props.crumbs}</div>
              )}
              <div className={classes.contentContainer}>{content}</div>
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
