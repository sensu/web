import * as React from "/vendor/react";

import Toolbar from "/lib/component/partial/Toolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

export interface MutatorDetailsToolbarProps {
  toolbarItems?: (items: any[]) => React.ReactNode;
}

const MutatorDetailsToolbar = ({
  toolbarItems,
}: MutatorDetailsToolbarProps) => {
  const toolbar = toolbarItems ? toolbarItems([]) : [];
  return <Toolbar right={<ToolbarMenu>{toolbar}</ToolbarMenu>} />;
};

export default MutatorDetailsToolbar;
