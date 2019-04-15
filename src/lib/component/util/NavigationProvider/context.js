// @flow
import * as React from "/vendor/react";

export interface LinkConfig {
  icon: React.ComponentType<>;
  caption: string;
  to: string;
}

export const { Provider, Consumer } = React.createContext<LinkConfig[]>([]);
