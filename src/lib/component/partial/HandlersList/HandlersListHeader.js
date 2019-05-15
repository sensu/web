import React from "/vendor/react";
import PropTypes from "prop-types";

import ListHeader from "/lib/component/partial/ListHeader";
import ListSortSelector from "/lib/component/partial/ListSortSelector";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";
import { SelectMenuItem } from "/lib/component/partial/ToolbarMenuItems";
import { ToolbarSelectOption } from "/lib/component/partial/ToolbarSelect";

import { toggleParam } from "/lib/util/filterParams";

const HANDLER_TYPES = [
  { label: "PIPE", value: "pipe" },
  { label: "SET", value: "set" },
  { label: "TCP", value: "tcp" },
  { label: "UDP", value: "udp" },
];

const HandlersListHeader = ({
  editable,
  filters,
  selectedItems,
  rowCount,
  onChangeQuery,
  onChangeFilters,
  order,
}) => {
  const onFilterHandlerType = toggleParam("type", onChangeFilters);
  const onSort = onChangeQuery;
  return (
    <ListHeader
      sticky
      editable={editable}
      selectedCount={selectedItems.length}
      rowCount={rowCount}
      renderActions={() => (
        <ToolbarMenu>
          <ToolbarMenu.Item key="type-filter" visible="always">
            <SelectMenuItem title="Type" onChange={onFilterHandlerType}>
              <ToolbarSelectOption value={null} />
              {HANDLER_TYPES.map(({ label, value }) => (
                <ToolbarSelectOption
                  key={value}
                  value={value}
                  selected={filters.type === value}
                >
                  {label}
                </ToolbarSelectOption>
              ))}
            </SelectMenuItem>
          </ToolbarMenu.Item>
          <ToolbarMenu.Item key="sort" visible="if-room">
            <ListSortSelector
              options={[{ label: "Name", value: "NAME" }]}
              onChangeQuery={onSort}
              value={order}
            />
          </ToolbarMenu.Item>
        </ToolbarMenu>
      )}
    />
  );
};

HandlersListHeader.propTypes = {
  editable: PropTypes.bool,
  filters: PropTypes.object,
  selectedItems: PropTypes.array.isRequired,
  rowCount: PropTypes.number.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeFilters: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
};

HandlersListHeader.defaultProps = {
  editable: false,
  filters: {},
};

export default HandlersListHeader;
