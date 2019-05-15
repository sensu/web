import React from "/vendor/react";
import PropTypes from "prop-types";

import { ResetMenuItem } from "/lib/component/partial/ToolbarMenuItems";
import ListToolbar from "/lib/component/partial/ListToolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

class EventsListToolbar extends React.PureComponent {
  static propTypes = {
    onClickReset: PropTypes.func.isRequired,
    toolbarItems: PropTypes.func,
    toolbarContent: PropTypes.node,
  };

  static defaultProps = {
    toolbarContent: <React.Fragment />,
    toolbarItems: ({ items }) => items,
  };

  reset = ev => {
    this.props.onClickReset(ev);
  };

  render() {
    const { toolbarContent, toolbarItems } = this.props;

    return (
      <ListToolbar
        search={toolbarContent}
        toolbarItems={props => (
          <ToolbarMenu>
            {toolbarItems({
              ...props,
              items: [
                <ToolbarMenu.Item
                  key="reset-query"
                  visible={props.collapsed ? "never" : "if-room"}
                >
                  <ResetMenuItem onClick={this.reset} />
                </ToolbarMenu.Item>,
              ],
            })}
          </ToolbarMenu>
        )}
      />
    );
  }
}

export default EventsListToolbar;
