import * as React from "/vendor/react";

import Toolbar from "/lib/component/partial/Toolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

export interface EventFilterDetailsToolbarProps {
  toolbarItems?: (items: any[]) => React.ReactNode;
}

const EventFilterDetailsToolbar = ({
  toolbarItems,
}: EventFilterDetailsToolbarProps) => {
  const toolbar = toolbarItems ? toolbarItems([]) : [];
  return <Toolbar right={<ToolbarMenu>{toolbar}</ToolbarMenu>} />;
};

export default EventFilterDetailsToolbar;
