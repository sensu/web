import React from "/vendor/react";
import PropTypes from "prop-types";

import { ResetMenuItem } from "/lib/component/partial/ToolbarMenuItems";

import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import ListToolbar from "/lib/component/partial/ListToolbar";

class MutatorsListToolbar extends React.PureComponent {
  static propTypes = {
    onClickReset: PropTypes.func.isRequired,
    toolbarContent: PropTypes.node,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
    toolbarContent: <React.Fragment />,
    toolbarItems: ({ items }) => items,
  };

  render() {
    const { onClickReset, toolbarItems, toolbarContent } = this.props;

    return (
      <ListToolbar
        search={toolbarContent}
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

export default MutatorsListToolbar;
