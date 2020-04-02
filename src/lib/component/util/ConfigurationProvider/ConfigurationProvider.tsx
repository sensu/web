import * as React from "/vendor/react";

import Context, { State } from "./context";

interface Props {
  state: State;
  children: React.ReactNode;
}

const ConfigurationProvider = ({ children, state }: Props) => {
  return <Context.Provider value={state}>{children}</Context.Provider>;
};

export default ConfigurationProvider;
