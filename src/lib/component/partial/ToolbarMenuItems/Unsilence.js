import React from "/vendor/react";

import { UnsilenceIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const Unsilence = props => <MenuItem {...props} />;

Unsilence.displayName = "ToolbarMenuItems.Unsilence";

Unsilence.defaultProps = {
  autoClose: false,
  title: "Clear silence",
  titleCondensed: "Clear silence",
  description: "Clear silences for target item(s).",
  icon: <UnsilenceIcon />,
};

export default Unsilence;
