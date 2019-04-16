import React from "/vendor/react";
import PropTypes from "prop-types";

import { SearchBox } from "/lib/component/base";

import { ResetMenuItem } from "/lib/component/partial/ToolbarMenuItems";

import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import ListToolbar from "/lib/component/partial/ListToolbar";

class EntitiesListToolbar extends React.PureComponent {
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

  render() {
    const { onChangeQuery, onClickReset, query, toolbarItems } = this.props;

    return (
      <ListToolbar
        search={
          <SearchBox
            placeholder="Filter entities…"
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
