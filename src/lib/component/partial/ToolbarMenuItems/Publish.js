import React from "/vendor/react";

import { PublishIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const Publish = props => <MenuItem {...props} />;

Publish.displayName = "ToolbarMenuItems.Publish";

Publish.defaultProps = {
  title: "Publish",
  description: "Publish target item(s).",
  icon: <PublishIcon />,
};

export default Publish;
