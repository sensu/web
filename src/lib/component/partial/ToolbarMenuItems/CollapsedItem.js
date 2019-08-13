import React from "/vendor/react";
import PropTypes from "prop-types";

import {
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "/vendor/@material-ui/core";
import { EmptyIcon } from "/lib/component/icon";

class CollapsedItem extends React.Component {
  static displayName = "ToolbarMenuItems.CollapsedItem";

  static propTypes = {
    component: PropTypes.func,
    title: PropTypes.node,
    icon: PropTypes.node,
    inset: PropTypes.bool,
    ornament: PropTypes.node,
    primary: PropTypes.node.isRequired,
    secondary: PropTypes.node,
  };

  static defaultProps = {
    component: MenuItem,
    icon: null,
    inset: true,
    ornament: null,
    secondary: null,
    title: null,
  };

  render() {
    const {
      component: Component,
      icon,
      inset,
      ornament,
      primary,
      secondary,
      title,
      ...props
    } = this.props;

    return (
      <MenuItem button title={title} {...props}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText
          inset={inset && !icon}
          primary={primary}
          secondary={secondary}
        />
        {ornament || (inset && <EmptyIcon />)}
      </MenuItem>
    );
  }
}

export default CollapsedItem;
