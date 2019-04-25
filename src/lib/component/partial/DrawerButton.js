/* eslint-disable react/prop-types */
import React from "/vendor/react";

import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from "/vendor/@material-ui/core";

class DrawerButton extends React.Component {
  static defaultProps = {
    component: "button",
  };

  render() {
    const { Icon, primary, component, ...props } = this.props;

    return (
      <ListItem {...props} component={component}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
    );
  }
}

export default DrawerButton;
