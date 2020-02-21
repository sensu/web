import * as React from "/vendor/react";

import Context, { LinkConfig, ToolbarItemConfig } from "./context";

interface Props {
  links: LinkConfig[];
  toolbarItems: ToolbarItemConfig[];
  children: React.ReactNode;
}

const NavigationProvider = ({ children, links, toolbarItems }: Props) => {
  return (
    <Context.Provider value={{ links, toolbarItems }}>
      {children}
    </Context.Provider>
  );
};

export default NavigationProvider;
