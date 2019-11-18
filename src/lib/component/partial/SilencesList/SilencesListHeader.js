import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import ListHeader from "/lib/component/partial/ListHeader";
import ListSortSelector from "/lib/component/partial/ListSortSelector";
import { ToolbarSelectOption } from "/lib/component/partial/ToolbarSelect";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import {
  SelectMenuItem,
  UnsilenceMenuItem,
} from "/lib/component/partial/ToolbarMenuItems";

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
        subscriptions(orderBy: OCCURRENCES, omitEntity: true) {
          values(limit: 25)
        }

        checks(limit: 100, orderBy: NAME_DESC) {
          nodes {
            name
          }
        }
      }
    `,
  };

  renderActions = () => {
    const {
      filters,
      onChangeFilters,
      onChangeQuery,
      namespace,
      order,
    } = this.props;

    const checks = namespace ? namespace.checks.nodes.map(o => o.name) : [];
    const subscriptions = namespace ? namespace.subscriptions.values : [];

    return (
      <ToolbarMenu>
        <ToolbarMenu.Item key="filter-by-check" visible="if-room">
          <SelectMenuItem
            title="Check"
            onChange={toggleParam("check", onChangeFilters)}
          >
            <ToolbarSelectOption value={null} />
            {checks.map(v => (
              <ToolbarSelectOption
                key={v}
                value={v}
                selected={filters.check === v}
              />
            ))}
          </SelectMenuItem>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="filter-by-subscription" visible="if-room">
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
