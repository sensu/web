import React from "react";
import PropTypes from "prop-types";

import RootRef from "@material-ui/core/RootRef";

import { ToolbarMenuContext } from "/lib/component/partial/ToolbarMenu";

import { MenuController } from "/lib/component/controller";

import Disclosure from "./Disclosure";

class Submenu extends React.Component {
  static displayName = "ToolbarMenuItems.Submenu";

  static propTypes = {
    autoClose: PropTypes.bool,
    renderMenu: PropTypes.func,
  };

  static defaultProps = {
    autoClose: true,
    renderMenu: () => null,
  };

  render() {
    const { autoClose, renderMenu, ...props } = this.props;

    return (
      <ToolbarMenuContext.Consumer>
        {({ collapsed, close: closeParent }) => (
          <MenuController
            renderMenu={({ close: closeMenu, ...renderProps }) => {
              let close = closeMenu;
              if (autoClose) {
                close = () => {
                  closeMenu();
                  closeParent();
                };
              }

              return renderMenu({ ...renderProps, close, closeParent });
            }}
          >
            {({ open, ref }) => (
              <RootRef rootRef={ref}>
                <Disclosure collapsed={collapsed} onClick={open} {...props} />
              </RootRef>
            )}
          </MenuController>
        )}
      </ToolbarMenuContext.Consumer>
    );
  }
}

export default Submenu;
