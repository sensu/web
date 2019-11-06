import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "/vendor/@material-ui/core";

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
});

class Breadcrumbs extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };
  render() {
    const location = window.location.href;
    const links = location.split("/");
    links.shift();
    links.shift();
    links.shift();
    console.log(links);
    const link = links.reduce((acc, currVal, i, array) => {
      return (
        <div>
          <a href="https://${window.location.href}/${acc}/$">{acc}</a>
          <a href="https://${window.location.href}/${acc}/${currVal}">
            {currVal}
          </a>
        </div>
      );
    });
    console.log(link);
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography className={classes.text} variant="body1">
          {link}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Breadcrumbs);
