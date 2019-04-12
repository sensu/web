// @flow
/* eslint-disable react/prop-types */

import * as React from "/vendor/react";

import { Consumer } from "./context";
import type { LinkConfig } from "./context";

interface Props {
  children(LinkConfig[]): React.Node;
}

class WithNavigation extends React.PureComponent<Props> {
  render() {
    return <Consumer {...this.props} />;
  }
}

export default WithNavigation;
