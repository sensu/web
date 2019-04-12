import React from "/vendor/react";
import PropTypes from "prop-types";

import { SearchBox } from "/lib/component/base";

import {
  NewMenuItem,
  ResetMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import ListToolbar from "/lib/component/partial/ListToolbar";

class SilencesListToolbar extends React.Component {
  static propTypes = {
    filter: PropTypes.string,
    onChangeQuery: PropTypes.func.isRequired,
    onClickCreate: PropTypes.func.isRequired,
    onClickReset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    filter: "",
  };

  render() {
    return (
      <ListToolbar
        search={
          <SearchBox
            placeholder="Filter silences…"
            initialValue={this.props.filter}
            onSearch={this.props.onChangeQuery}
          />
        }
        toolbarItems={({ collapsed }) => {
          const unlessCollapsed = visiblity =>
            collapsed ? "never" : visiblity;

          return (
            <ToolbarMenu>
              <ToolbarMenu.Item id="new" visible={unlessCollapsed("always")}>
                <NewMenuItem
                  title="New Silence…"
                  onClick={this.props.onClickCreate}
                />
              </ToolbarMenu.Item>
              <ToolbarMenu.Item id="reset" visible={unlessCollapsed("if-room")}>
                <ResetMenuItem onClick={this.props.onClickReset} />
              </ToolbarMenu.Item>
            </ToolbarMenu>
          );
        }}
      />
    );
  }
}

export default SilencesListToolbar;
