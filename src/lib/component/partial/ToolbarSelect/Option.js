import React from "/vendor/react";
import PropTypes from "prop-types";

import {
  MenuItem,
  ListItemText,
  ListItemIcon,
} from "/vendor/@material-ui/core";

import { SmallCheckIcon } from "/lib/component/icon";

class Option extends React.PureComponent {
  static displayName = "ToolbarSelect.Option";

  static propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
    value: PropTypes.any.isRequired,
  };

  static defaultProps = {
    selected: false,
    children: null,
  };

  render() {
    const { value, selected, children, ...props } = this.props;
    const label = children || value;

    return (
      <MenuItem key={value} value={value} {...props}>
        {selected && (
          <ListItemIcon>
            <SmallCheckIcon />
          </ListItemIcon>
        )}
        <ListItemText inset={selected} primary={label} />
      </MenuItem>
    );
  }
}

export default Option;
