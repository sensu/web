import React from "/vendor/react";

import Context, { LinkConfig } from "./context";

interface Props {
  children(links: LinkConfig[]): React.ReactNode;
}

class WithNavigation extends React.PureComponent<Props> {
  public render(): React.ReactElement {
    return <Context.Consumer {...this.props} />;
  }
}

export default WithNavigation;
