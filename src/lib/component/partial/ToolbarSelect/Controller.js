import React from "/vendor/react";
import PropTypes from "prop-types";

import { RootRef } from "/vendor/@material-ui/core";

import { MenuController } from "/lib/component/controller";

import Menu from "./Menu";

class Controller extends React.PureComponent {
  static displayName = "ToolbarSelect.Controller";

  static propTypes = {
    children: PropTypes.func.isRequired,
    collapsed: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.node).isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    collapsed: false,
    onClose: () => null,
  };

  render() {
    const { children, collapsed, onChange, onClose, options } = this.props;

    return (
      <MenuController
        renderMenu={({ anchorEl, close }) => (
          <Menu
            anchorEl={anchorEl}
            orient={collapsed ? "right" : "left"}
            onChange={onChange}
            onClose={() => {
              onClose();
              close();
            }}
          >
            {options}
          </Menu>
        )}
      >
        {({ open, ref }) => (
          <RootRef rootRef={ref}>{children({ open })}</RootRef>
        )}
      </MenuController>
    );
  }
}

export default Controller;
