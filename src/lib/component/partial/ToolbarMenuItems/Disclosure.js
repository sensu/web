import React from "/vendor/react";
import PropTypes from "prop-types";

import { ArrowDropDownIcon, KeyboardArrowRightIcon } from "/lib/component/icon";

import MenuItem from "./AdaptiveMenuItem";

const buttonIcon = <ArrowDropDownIcon />;
const menuIcon = <KeyboardArrowRightIcon />;

class Disclosure extends React.Component {
  static displayName = "ToolbarMenuItems.Disclosure";

  static propTypes = {
    collapsed: PropTypes.bool,
  };

  static defaultProps = {
    collapsed: false,
  };

  render() {
    const { collapsed, ...props } = this.props;

    return (
      <MenuItem
        inset="false"
        collapsed={collapsed}
        ornament={collapsed ? menuIcon : buttonIcon}
        {...props}
      />
    );
  }
}

export default Disclosure;
