import React from "/vendor/react";
import PropTypes from "prop-types";

import { MenuItem, ListItemText } from "/vendor/@material-ui/core";

class Option extends React.PureComponent {
  static displayName = "ToolbarSelect.Option";

  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    value: PropTypes.any.isRequired,
  };

  static defaultProps = {
    children: null,
    disabled: false,
    selected: false,
  };

  render() {
    const { value, children, ...props } = this.props;
    const label = children || value;

    return (
      <MenuItem key={value} value={value} {...props}>
        <ListItemText primary={label} />
      </MenuItem>
    );
  }
}

export default Option;
