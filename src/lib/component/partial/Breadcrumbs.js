import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "/vendor/@material-ui/core";
import classNames from "/vendor/classnames";

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
  list: {
    width: "100%",
    textDecoration: "none",
  },
  listItem: {
    display: "inline",
    marginRight: "16px",
  },
  link: {
    color: theme.palette.text.primary,
  },
});

class Breadcrumbs extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };
  render() {
    const { classes } = this.props;
    const location = window.location.href;
    const links = location.split("/");
    links.shift();
    links.shift();
    links.shift();
    const link = links.map((acc, currVal, i, array) => {
      return (
        <li key={i} className={classes.listItem}>
          <a
            className={classes.link}
            href={`https://${window.location.host}/${acc}/`}
          >
            {acc}
          </a>
        </li>
      );
    });
    return (
      <div className={classes.root}>
        <Typography className={classes.text} variant="body1">
          <ul>{link}</ul>
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Breadcrumbs);
