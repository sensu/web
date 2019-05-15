import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  SelectMenuItem,
  SilenceMenuItem,
  UnsilenceMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

import ListHeader from "/lib/component/partial/ListHeader";
import ListSortSelector from "/lib/component/partial/ListSortSelector";
import { ToolbarSelectOption } from "/lib/component/partial/ToolbarSelect";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

import { toggleParam } from "/lib/util/filterParams";

class EntitiesListHeader extends React.PureComponent {
  static propTypes = {
    editable: PropTypes.bool.isRequired,
    filters: PropTypes.object.isRequired,
    namespace: PropTypes.object,
    onChangeFilters: PropTypes.object.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    onClickClearSilences: PropTypes.func.isRequired,
    onClickSelect: PropTypes.func,
    onClickSilence: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    selectedItems: PropTypes.array.isRequired,
  };

  static defaultProps = {
    onClickSelect: () => {},
    namespace: undefined,
  };

  static fragments = {
    namespace: gql`
      fragment EntitiesListHeader_namespace on Namespace {
        subscriptions(orderBy: OCCURRENCES, omitEntity: true) {
          values(limit: 25)
        }
      }
    `,
  };

  renderActions = () => {
    const {
      filters,
      namespace,
      onChangeFilters,
      onChangeQuery,
      order,
    } = this.props;

    const subscriptions = namespace ? namespace.subscriptions.values : [];
    return (
      <ToolbarMenu>
        <ToolbarMenu.Item key="filter-by-class" visible="if-room">
          <SelectMenuItem
            title="Entity Class"
            onChange={toggleParam("class", onChangeFilters)}
          >
            <ToolbarSelectOption value={null} />
            {["agent", "proxy"].map(v => (
              <ToolbarSelectOption
                key={v}
                value={v}
                selected={filters.class === v}
              />
            ))}
          </SelectMenuItem>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="filter-by-subscriptions" visible="if-room">
          <SelectMenuItem
            title="Subscription"
            onChange={toggleParam("subscription", onChangeFilters)}
          >
            <ToolbarSelectOption value={null} />
            {subscriptions.map(v => (
              <ToolbarSelectOption
                key={v}
                value={v}
                selected={filters.subscription === v}
              />
            ))}
          </SelectMenuItem>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="sort" visible="if-room">
          <ListSortSelector
            options={[{ label: "Name", value: "ID" }]}
            onChangeQuery={onChangeQuery}
            value={order}
          />
        </ToolbarMenu.Item>
      </ToolbarMenu>
    );
  };

  renderBulkActions = () => {
    const { selectedItems } = this.props;

    const selectedCount = selectedItems.length;
    const selectedSilenced = selectedItems.filter(en => en.silences.length > 0);
    const allSelectedSilenced = selectedSilenced.length === selectedCount;
    const allSelectedUnsilenced = selectedSilenced.length === 0;

    return (
      <ToolbarMenu>
        <ToolbarMenu.Item
          key="silence"
          visible={allSelectedSilenced ? "never" : "always"}
        >
          <SilenceMenuItem
            description="Create a silence targeting selected entities."
            disabled={allSelectedSilenced}
            onClick={this.props.onClickSilence}
          />
        </ToolbarMenu.Item>

        <ToolbarMenu.Item
          key="unsilence"
          visible={allSelectedUnsilenced ? "never" : "if-room"}
        >
          <UnsilenceMenuItem
            description="Clear silences associated with selected entities."
            disabled={allSelectedUnsilenced}
            onClick={this.props.onClickClearSilences}
          />
        </ToolbarMenu.Item>
      </ToolbarMenu>
    );
  };

  render() {
    const { editable, onClickSelect, selectedItems, rowCount } = this.props;
    const selectedCount = selectedItems.length;

    return (
      <ListHeader
        sticky
        editable={editable}
        selectedCount={selectedCount}
        rowCount={rowCount}
        onClickSelect={onClickSelect}
        renderBulkActions={this.renderBulkActions}
        renderActions={this.renderActions}
      />
    );
  }
}

export default EntitiesListHeader;
