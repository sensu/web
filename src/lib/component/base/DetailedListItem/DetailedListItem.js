import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles } from "/vendor/@material-ui/core";

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(0.5),
    "&:first-child": {
      paddingTop: 0,
    },
  },
});

class DetailedListItem extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { classes, children } = this.props;
    return <li className={classes.root}>{children}</li>;
  }
}

export default withStyles(styles)(DetailedListItem);
