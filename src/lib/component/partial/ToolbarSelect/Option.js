import React from "/vendor/react";
import PropTypes from "prop-types";

import { Item, ItemText, ItemIcon } from "/vendor/@material-ui/core";

import { SmallCheckIcon } from "/lib/component/icon";

class Option extends React.PureComponent {
  static displayName = "ToolbarSelect.Option";

  static propTypes = {
    children: PropTypes.node,
    selected: PropTypes.bool,
    value: PropTypes.any.isRequired,
  };

  static defaultProps = {
    selected: false,
    children: null,
  };

  render() {
    const { value, selected, children, ...props } = this.props;
    const label = children || value;

    return (
      <Item key={value} value={value} {...props}>
        {selected && (
          <ItemIcon>
            <SmallCheckIcon />
          </ItemIcon>
        )}
        <ItemText inset={selected} primary={label} />
      </Item>
    );
  }
}

export default Option;
