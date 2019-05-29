import * as React from "/vendor/react";

import Context, { LinkConfig } from "./context";

interface Props {
  links: LinkConfig[];
  children: React.ReactNode;
}

class NavigationProvider extends React.PureComponent<Props> {
  public render(): React.ReactElement {
    return (
      <Context.Provider value={this.props.links}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default NavigationProvider;
