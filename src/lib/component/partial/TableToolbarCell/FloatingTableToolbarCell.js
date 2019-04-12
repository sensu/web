/* eslint-disable react/no-unused-prop-types */

import React from "/vendor/react";
import PropTypes from "prop-types";
import Media from "react-media";

import { withStyles } from "/vendor/@material-ui/core";
import TableToolbarCell from "./TableToolbarCell";

const styles = theme => ({
  soft: {
    color: theme.palette.text.secondary,
  },
});

class FloatingTableToolbarCell extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    hovered: PropTypes.bool,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    hovered: false,
  };

  renderCell = ({ canHover, ...props }) => {
    const { hovered, disabled: disabledProp, children } = props;
    const disabled = disabledProp || (canHover && !hovered);

    return (
      <TableToolbarCell
        className={props.classes.soft}
        floating={canHover}
        disabled={disabled}
      >
        {children}
      </TableToolbarCell>
    );
  };

  render() {
    return (
      <Media query="screen and (any-hover)">
        {canHover => this.renderCell({ canHover, ...this.props })}
      </Media>
    );
  }
}

export default withStyles(styles)(FloatingTableToolbarCell);
