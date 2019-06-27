import React from "/vendor/react";

import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import { SelectMenuItem } from "/lib/component/partial/ToolbarMenuItems";
import ListHeader from "/lib/component/partial/ListHeader";
import ListSortSelector from "/lib/component/partial/ListSortSelector";
import { ToolbarSelectOption } from "/lib/component/partial/ToolbarSelect";

import {
  toggleParam,
  SetFiltersFunc,
  FilterParamMap,
} from "/lib/util/filterParams";

const EVENT_FILTER_ACTION_TYPES = [
  { label: "ALLOW", value: "allow" },
  { label: "DENY", value: "deny" },
];

interface Props {
  editable: boolean;
  filters: FilterParamMap;
  onChangeFilters: SetFiltersFunc;
  order?: string;
  rowCount: number;
}

export const EventFiltersListHeader = ({
  editable,
  filters,
  onChangeFilters,
  order,
  rowCount,
}: Props) => {
  const renderActions: () => React.ReactNode = () => {
    return (
      <ToolbarMenu>
        <ToolbarMenu.Item key="filter-by-action" visible="if-room">
          <SelectMenuItem
            title="Action"
            onChange={toggleParam("action", onChangeFilters)}
          >
            <ToolbarSelectOption value={null} />
            {EVENT_FILTER_ACTION_TYPES.map(({ label, value }) => (
              <ToolbarSelectOption
                key={value}
                value={value}
                selected={filters.action === value}
              >
                {label}
              </ToolbarSelectOption>
            ))}
          </SelectMenuItem>
        </ToolbarMenu.Item>
        <ToolbarMenu.Item key="sort" visible="if-room">
          <ListSortSelector
            options={[{ label: "Name", value: "NAME" }]}
            value={order}
          />
        </ToolbarMenu.Item>
      </ToolbarMenu>
    );
  };

  return (
    <ListHeader
      sticky
      editable={editable}
      rowCount={rowCount}
      renderActions={renderActions}
    />
  );
};

export default EventFiltersListHeader;
