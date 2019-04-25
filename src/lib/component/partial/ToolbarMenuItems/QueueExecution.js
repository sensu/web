import React from "/vendor/react";

import { QueueIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const QueueExecution = props => <MenuItem {...props} />;

QueueExecution.displayName = "ToolbarMenuItems.QueueExecution";

QueueExecution.defaultProps = {
  title: "Execute",
  description: "Queue up ad-hoc execution for check(s).",
  icon: <QueueIcon />,
};

export default QueueExecution;
