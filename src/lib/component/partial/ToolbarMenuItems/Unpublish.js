import React from "/vendor/react";

import { UnpublishIcon } from "/lib/component/icon";
import MenuItem from "./MenuItem";

const Unpublish = props => <MenuItem {...props} />;

Unpublish.displayName = "ToolbarMenuItems.Unpublish";

Unpublish.defaultProps = {
  title: "Unpublish",
  description: "Unpublish target item(s).",
  icon: <UnpublishIcon />,
};

export default Unpublish;
