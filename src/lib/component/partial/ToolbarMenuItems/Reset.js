import React from "/vendor/react";
import { compose, setDisplayName, defaultProps } from "recompose";

import { ResetIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const icon = <ResetIcon />;
const enhance = compose(
  setDisplayName("ToolbarMenuItems.Reset"),
  defaultProps({
    title: "Reset",
    icon,
  }),
);
export default enhance(MenuItem);
