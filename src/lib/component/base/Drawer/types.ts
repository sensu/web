export interface Link {
  id: string;
  icon?: React.ReactElement;
  contents: React.ReactElement;
  adornment?: React.ReactElement;
  onClick?: () => void;
  href?: string;
  hint?: React.ReactElement;
}

export interface Folder {
  id: string;
  icon: React.ReactElement;
  contents: React.ReactElement;
  links: Link[];
}

export type MenuItem = Link | Folder;

export interface ToolbarItem {
  id: string;
  icon?: React.ReactElement;
  onClick?: () => void;
  href?: string;
  hint?: React.ReactElement;
}
