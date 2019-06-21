import React from "/vendor/react";
import PropTypes from "prop-types";

import { RootRef } from "/vendor/@material-ui/core";

import { MenuController } from "/lib/component/controller";

import { DisclosureMenuItem } from "/lib/component/partial/ToolbarMenuItems";

import Menu from "./ListSortSelectorMenu";

class ListSortSelector extends React.Component {
  static propTypes = {
    renderButton: PropTypes.func,
  };

  static defaultProps = {
    renderButton: ({ idx, open, ref }) => (
      <RootRef rootRef={ref}>
        <DisclosureMenuItem
          aria-owns={idx}
          aria-haspopup="true"
          label="Sort"
          onClick={open}
        />
      </RootRef>
    ),
  };

  renderMenu = ({ anchorEl, idx, close }) => {
    const { renderButton, ...props } = this.props;
    return <Menu anchorEl={anchorEl} id={idx} onClose={close} {...props} />;
  };

  render() {
    return (
      <MenuController renderMenu={this.renderMenu}>
        {this.props.renderButton}
      </MenuController>
    );
  }
}

export default ListSortSelector;
