import React from "/vendor/react";

export interface LinkConfig {
  icon: React.ComponentType<any>;
  caption: string;
  to: string;
}

export default React.createContext<LinkConfig[]>([]);
