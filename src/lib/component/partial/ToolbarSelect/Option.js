import React from "/vendor/react";
import PropTypes from "prop-types";

import { MenuItem, ListItemText } from "/vendor/@material-ui/core";
import { EmptyIcon } from "/lib/component/icon";

class Option extends React.PureComponent {
  static displayName = "ToolbarSelect.Option";

  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    inset: PropTypes.bool,
    value: PropTypes.any,
  };

  static defaultProps = {
    children: null,
    disabled: false,
    selected: false,
    inset: false,
    value: null,
  };

  render() {
    const { inset, value, children, ...props } = this.props;
    const label = children || value;

    return (
      <MenuItem key={value} value={value} {...props}>
        <ListItemText inset={inset} primary={label} />
        {inset && <EmptyIcon />}
      </MenuItem>
    );
  }
}

export default Option;
