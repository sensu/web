import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, TableCell } from "/vendor/@material-ui/core";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 0,

    "&, & *": {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },

    "&:first-child": {
      paddingLeft: theme.spacing(2.5),
    },
  },
});

class TableOverflowCell extends React.PureComponent {
  static propTypes = { classes: PropTypes.object.isRequired };

  render() {
    const { classes, ...props } = this.props;
    return <TableCell {...props} className={classes.root} padding="none" />;
  }
}

export default withStyles(styles)(TableOverflowCell);
