import React from "/vendor/react";
import { compose, setDisplayName, defaultProps } from "recompose";

import { NewIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const enhance = compose(
  setDisplayName("ToolbarMenuItems.New"),
  defaultProps({
    title: "New…",
    titleCondensed: "New",
    icon: <NewIcon />,
  }),
);
export default enhance(MenuItem);
