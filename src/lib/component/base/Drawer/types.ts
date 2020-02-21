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
  links: LinkConfig[];
}

export type MenuItemConfig = LinkConfig | FolderConfig;

export interface ToolbarItemConfig {
  id: string;
  icon?: React.ReactElement;
  onClick?: () => void;
  href?: string;
  hint?: React.ReactElement;
}
