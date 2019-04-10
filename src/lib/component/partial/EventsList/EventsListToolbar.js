import React from "react";
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
  };

  static defaultProps = {
    query: "",
  };

  reset = ev => {
    this.props.onClickReset(ev);
  };

  render() {
    const { onChangeQuery, query } = this.props;

    return (
      <ListToolbar
        search={
          <SearchBox
            placeholder="Filter events…"
            initialValue={query}
            onSearch={onChangeQuery}
          />
        }
        toolbarItems={({ collapsed }) => (
          <ToolbarMenu>
            <ToolbarMenu.Item
              id="reset-query"
              visible={collapsed ? "never" : "if-room"}
            >
              <ResetMenuItem onClick={this.reset} />
            </ToolbarMenu.Item>
          </ToolbarMenu>
        )}
      />
    );
  }
}

export default EventsListToolbar;
