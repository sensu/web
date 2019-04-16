import React from "/vendor/react";
import PropTypes from "prop-types";

import { SearchBox } from "/lib/component/base";

import { ResetMenuItem } from "/lib/component/partial/ToolbarMenuItems";

import ListToolbar from "/lib/component/partial/ListToolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

class EventsListToolbar extends React.PureComponent {
  static propTypes = {
    query: PropTypes.string,
    onChangeQuery: PropTypes.func.isRequired,
    onClickReset: PropTypes.func.isRequired,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
    query: "",
    toolbarItems: ({ items }) => items,
  };

  reset = ev => {
    this.props.onClickReset(ev);
  };

  render() {
    const { onChangeQuery, query, toolbarItems } = this.props;

    return (
      <ListToolbar
        search={
          <SearchBox
            placeholder="Filter events…"
            initialValue={query}
            onSearch={onChangeQuery}
          />
        }
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
