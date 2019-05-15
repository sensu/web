import React from "/vendor/react";
import PropTypes from "prop-types";

import { ResetMenuItem } from "/lib/component/partial/ToolbarMenuItems";

import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import ListToolbar from "/lib/component/partial/ListToolbar";

class ChecksListToolbar extends React.PureComponent {
  static propTypes = {
    onClickReset: PropTypes.func.isRequired,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
    toolbarItems: ({ items }) => items,
  };

  render() {
    const { onClickReset, toolbarItems } = this.props;

    return (
      <ListToolbar
        search={<React.Fragment />}
        toolbarItems={props => (
          <ToolbarMenu>
            {toolbarItems({
              ...props,
              items: [
                <ToolbarMenu.Item
                  key="reset"
                  visible={props.collapsed ? "never" : "if-room"}
                >
                  <ResetMenuItem onClick={onClickReset} />
                </ToolbarMenu.Item>,
              ],
            })}
          </ToolbarMenu>
        )}
      />
    );
  }
}

export default ChecksListToolbar;
