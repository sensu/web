import React from "/vendor/react";

import { NewIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const New = props => <MenuItem {...props} />;

New.displayName = "ToolbarMenuItems.New";

New.defaultProps = {
  title: "New…",
  titleCondensed: "New",
  icon: <NewIcon />,
};

export default New;
