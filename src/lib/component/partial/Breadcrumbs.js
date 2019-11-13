import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "/vendor/@material-ui/core";
import classNames from "/vendor/classnames";

import { NamespaceLink } from "/lib/component/util";

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
    let url = "";
    const namespace = links[0];
    const link = links.map((currVal, i) => {
      url += `/${currVal}`;
      return (
        <li key={i} className={classes.listItem}>
          <NamespaceLink
            namespace={namespace}
            className={classes.link}
            to={`https://${window.location.host}${url}`}
          >
            {currVal}
          </NamespaceLink>
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
