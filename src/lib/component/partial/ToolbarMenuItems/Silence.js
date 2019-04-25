import React from "/vendor/react";

import { SilenceIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const Silence = props => <MenuItem {...props} />;

Silence.displayName = "ToolbarMenuItems.Silence";

Silence.defaultProps = {
  autoClose: false,
  title: "Silence",
  description: "Create a silence for target item(s).",
  icon: <SilenceIcon />,
};

export default Silence;
