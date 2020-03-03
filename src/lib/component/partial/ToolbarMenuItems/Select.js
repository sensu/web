import React from "/vendor/react";
import PropTypes from "prop-types";

import { ToolbarMenuContext } from "/lib/component/partial/ToolbarMenu";
import { ToolbarSelectController } from "/lib/component/partial/ToolbarSelect";

import Disclosure from "./Disclosure";

class Select extends React.Component {
  static displayName = "ToolbarMenuItems.Select";

  static propTypes = {
    autoClose: PropTypes.bool,
    children: PropTypes.node,
    disableEmptySelection: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    autoClose: true,
    children: [],
    disableEmptySelection: false,
    onChange: () => false,
  };

  render() {
    const {
      autoClose,
      children,
      disableEmptySelection,
      onChange: onChangeProp,
      ...props
    } = this.props;

    return (
      <ToolbarMenuContext.Consumer>
        {({ collapsed, close: closeProp }) => {
          const close = autoClose ? closeProp : () => null;

          let onChange = onChangeProp;
          if (autoClose) {
            onChange = val => {
              onChangeProp(val);
              closeProp();
            };
          }

          return (
            <ToolbarSelectController
              collapsed={collapsed}
              disableEmptySelection={disableEmptySelection}
              onChange={onChange}
              onClose={close}
              options={children}
            >
              {ctrl => (
                <Disclosure
                  {...props}
                  collapsed={collapsed}
                  onClick={ctrl.open}
                />
              )}
            </ToolbarSelectController>
          );
        }}
      </ToolbarMenuContext.Consumer>
    );
  }
}

export default Select;
