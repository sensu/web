import React from "/vendor/react";
import { compose, setDisplayName, defaultProps } from "recompose";

import { SmallCheckIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const enhance = compose(
  setDisplayName("ToolbarMenuItems.Resolve"),
  defaultProps({
    title: "Resolve",
    description: "Set status of event(s) to resolved state.",
    icon: <SmallCheckIcon />,
  }),
);
export default enhance(MenuItem);
