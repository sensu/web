import React from "/vendor/react";

import Context, { LinkConfig, ToolbarItemConfig } from "./context";

interface State {
  links: LinkConfig[];
  toolbarItems: ToolbarItemConfig[];
}

interface Props {
  children(_: State): React.ReactNode;
}

class WithNavigation extends React.PureComponent<Props> {
  public render(): React.ReactElement {
    return <Context.Consumer {...this.props} />;
  }
}

export default WithNavigation;
