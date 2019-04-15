// @flow
/* eslint-disable react/prop-types */

import * as React from "/vendor/react";

import { Provider } from "./context";
import type { LinkConfig } from "./context";

interface Props {
  links: LinkConfig[];
  children: React.Node;
}

class NavigationProvider extends React.PureComponent<Props> {
  render() {
    return <Provider value={this.props.links}>{this.props.children}</Provider>;
  }
}

export default NavigationProvider;
