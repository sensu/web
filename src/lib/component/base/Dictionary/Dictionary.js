import React from "/vendor/react";
import PropTypes from "prop-types";
import classnames from "/vendor/classnames";
import { withStyles } from "/vendor/@material-ui/core";

const styles = () => ({
  root: {
    border: 0,
    width: "100%",
    tableLayout: "auto",
  },
});

class Dictionary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: null,
  };

  render() {
    const { className: classNameProp, classes, children } = this.props;
    const className = classnames(classes.root, classNameProp);

    return (
      <table className={className}>
        <tbody>{children}</tbody>
      </table>
    );
  }
}

export default withStyles(styles)(Dictionary);
