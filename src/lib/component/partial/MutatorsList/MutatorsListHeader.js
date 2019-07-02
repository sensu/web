import React from "/vendor/react";
import PropTypes from "prop-types";

import ListHeader from "/lib/component/partial/ListHeader";
import ListSortSelector from "/lib/component/partial/ListSortSelector";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

const MutatorsListHeader = ({
  editable,
  selectedItems,
  rowCount,
  onChangeQuery,
  order,
}) => {
  const onSort = onChangeQuery;
  return (
    <ListHeader
      sticky
      editable={editable}
      selectedCount={selectedItems.length}
      rowCount={rowCount}
      renderActions={() => (
        <ToolbarMenu>
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

MutatorsListHeader.propTypes = {
  editable: PropTypes.bool,
  selectedItems: PropTypes.array.isRequired,
  rowCount: PropTypes.number.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
};

MutatorsListHeader.defaultProps = {
  editable: true,
};

export default MutatorsListHeader;
