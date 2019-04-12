import React from "/vendor/react";
import PropTypes from "prop-types";
import lowerFirst from "lodash/lowerFirst";
import cronstrue from "/vendor/cronstrue";
import { Tooltip } from "/vendor/@material-ui/core";

class CronDescriptor extends React.PureComponent {
  static propTypes = {
    capitalize: PropTypes.bool,
    expression: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  };

  static defaultProps = {
    capitalize: false,
    component: "span",
  };

  render() {
    const { capitalize, expression, component: Component } = this.props;

    let statement = cronstrue.toString(expression);
    if (!capitalize) {
      statement = lowerFirst(statement);
    }

    return (
      <Tooltip title={expression}>
        <Component>{statement}</Component>
      </Tooltip>
    );
  }
}

export default CronDescriptor;
