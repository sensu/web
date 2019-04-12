import React from "/vendor/react";
import PropTypes from "prop-types";
import classnames from "/vendor/classnames";
import { withStyles, Typography } from "/vendor/@material-ui/core";

const styles = theme => ({
  root: {
    // ...
  },
  inset: {
    paddingLeft: theme.spacing.unit * 2.5,
  },
});

class DetailedListItemSubtitle extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    inset: PropTypes.bool,
  };

  static defaultProps = {
    inset: false,
  };

  render() {
    const { classes, children, inset, ...props } = this.props;
    const className = classnames(classnames.root, { [classes.inset]: inset });

    return (
      <Typography
        variant="body2"
        color="textSecondary"
        className={className}
        {...props}
      >
        {children}
      </Typography>
    );
  }
}

export default withStyles(styles)(DetailedListItemSubtitle);
