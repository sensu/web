import React from "/vendor/react";

import { ResetIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const Reset = props => <MenuItem {...props} />;

Reset.displayName = "ToolbarMenuItems.Reset";

Reset.defaultProps = {
  title: "Reset",
  icon: <ResetIcon />,
};

export default Reset;
