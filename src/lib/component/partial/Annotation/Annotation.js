import React from "/vendor/react";
import PropTypes from "prop-types";
import { CodeBlock } from "/lib/component/base";
import { parseLink } from "/lib/component/util";

class Annotation extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return <CodeBlock>{parseLink(this.props.children)}</CodeBlock>;
  }
}

export default Annotation;
