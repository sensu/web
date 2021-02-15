import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import ListHeader from "/lib/component/partial/ListHeader";
import ListSortSelector from "/lib/component/partial/ListSortSelector";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import {
  UnsilenceMenuItem,
  DisclosureMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import AutosuggestSelectMenu from "/lib/component/partial/AutosuggestSelectMenu";
import MenuController from "/lib/component/controller/MenuController";
import RootRef from "@material-ui/core/RootRef";

import { toggleParam } from "/lib/util/filterParams";

class SilencesListHeader extends React.PureComponent {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    filters: PropTypes.array.isRequired,
    onClickClearSilences: PropTypes.func.isRequired,
    onClickSelect: PropTypes.func.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    onChangeFilters: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    selectedItems: PropTypes.array,
    rowCount: PropTypes.number,
    namespace: PropTypes.object,
  };

  static defaultProps = {
    rowCount: 0,
    selectedItems: [],
    namespace: null,
  };

  static fragments = {
    namespace: gql`
      fragment SilencesListHeader_namespace on Namespace {
        name
      }
    `,
  };

  renderActions = () => {
    const { onChangeFilters, onChangeQuery, namespace, order } = this.props;

    return (
      <ToolbarMenu>
        <ToolbarMenu.Item key="filter-by-check" visible="if-room">
          <MenuController
            renderMenu={({ anchorEl, close }) => (
              <AutosuggestSelectMenu
                anchorEl={anchorEl}
                onClose={close}
                resourceType="checks"
                objRef="core/v2/silenced/check"
                onChange={toggleParam("check", onChangeFilters)}
                namespace={namespace && namespace.name}
              />
            )}
          >
            {({ open, ref }) => (
              <RootRef rootRef={ref}>
                <DisclosureMenuItem onClick={open} title="Check" />
              </RootRef>
            )}
          </MenuController>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="filter-by-subscription" visible="if-room">
          <MenuController
            renderMenu={({ anchorEl, close }) => (
              <AutosuggestSelectMenu
                anchorEl={anchorEl}
                onClose={close}
                resourceType="subscriptions"
                objRef="core/v2/silenced/subscription"
                onChange={toggleParam("subscription", onChangeFilters)}
                namespace={namespace && namespace.name}
              />
            )}
          >
            {({ open, ref }) => (
              <RootRef rootRef={ref}>
                <DisclosureMenuItem onClick={open} title="Subscription" />
              </RootRef>
            )}
          </MenuController>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="sort" visible="always">
          <ListSortSelector
            onChangeQuery={onChangeQuery}
            options={[
              { label: "Name", value: "ID" },
              { label: "Start Date", value: "BEGIN" },
            ]}
            value={order}
          />
        </ToolbarMenu.Item>
      </ToolbarMenu>
    );
  };

  renderBulkActions = () => (
    <ToolbarMenu>
      <ToolbarMenu.Item key="clearSilence" visible="always">
        <UnsilenceMenuItem onClick={this.props.onClickClearSilences} />
      </ToolbarMenu.Item>
    </ToolbarMenu>
  );

  render() {
    const { editable, onClickSelect, selectedItems, rowCount } = this.props;

    return (
      <ListHeader
        sticky
        editable={editable}
        selectedCount={selectedItems.length}
        onClickSelect={onClickSelect}
        renderActions={this.renderActions}
        renderBulkActions={this.renderBulkActions}
        rowCount={rowCount}
      />
    );
  }
}

export default SilencesListHeader;
