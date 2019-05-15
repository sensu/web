import React from "/vendor/react";
import PropTypes from "prop-types";

import { ResetMenuItem } from "/lib/component/partial/ToolbarMenuItems";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import ListToolbar from "/lib/component/partial/ListToolbar";

class EntitiesListToolbar extends React.PureComponent {
  static propTypes = {
    onClickReset: PropTypes.func.isRequired,
    toolbarItems: PropTypes.func,
    toolbarContent: PropTypes.node,
  };

  static defaultProps = {
    toolbarContent: <React.Fragment />,
    toolbarItems: ({ items }) => items,
  };

  render() {
    const { onClickReset, toolbarContent, toolbarItems } = this.props;

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

export default EntitiesListToolbar;
