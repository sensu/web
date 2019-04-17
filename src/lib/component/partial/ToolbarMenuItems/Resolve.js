import React from "/vendor/react";

import { SmallCheckIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const Resolve = props => <MenuItem {...props} />;

Resolve.displayName = "ToolbarMenuItems.Resolve";

Resolve.defaultProps = {
  title: "Resolve",
  description: "Set status of event(s) to resolved state.",
  icon: <SmallCheckIcon />,
};

export default Resolve;
