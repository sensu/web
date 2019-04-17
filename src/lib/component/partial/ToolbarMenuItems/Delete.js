import React from "/vendor/react";

import { DeleteIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const Delete = props => <MenuItem {...props} />;

Delete.displayName = "ToolbarMenuItems.Delete";

Delete.defaultProps = {
  autoClose: false,
  description: "Permenantly delete resource.",
  icon: <DeleteIcon />,
  title: "Delete…",
  titleCondensed: "Delete",
};

export default Delete;
