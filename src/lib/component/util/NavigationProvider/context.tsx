import React from "/vendor/react";

export interface LinkConfig {
  id: string;
  icon?: React.ReactElement;
  contents: React.ReactElement;
  adornment?: React.ReactElement;
  onClick?: () => void;
  href?: string;
  hint?: React.ReactElement;
}

export interface FolderConfig {
  id: string;
  icon: React.ReactElement;
  contents: React.ReactElement;
  children: LinkConfig[];
}

export type MenuItemConfig = LinkConfig | FolderConfig;

export interface ToolbarItemConfig {
  id: string;
  icon?: React.ReactElement;
  onClick?: () => void;
  href?: string;
  hint?: React.ReactElement;
}

interface State {
  links: LinkConfig[];
  toolbarItems: ToolbarItemConfig[];
}

export default React.createContext<State>({ links: [], toolbarItems: [] });
