import React from "/vendor/react";
import { compose, setDisplayName, defaultProps } from "recompose";

import { QueueIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const enhance = compose(
  setDisplayName("ToolbarMenuItems.QueueExecution"),
  defaultProps({
    title: "Execute",
    description: "Queue up ad-hoc execution for check(s).",
    icon: <QueueIcon />,
  }),
);
export default enhance(MenuItem);
