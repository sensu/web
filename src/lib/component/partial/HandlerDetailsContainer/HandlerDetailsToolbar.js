import React from "/vendor/react";
import PropTypes from "prop-types";

import Toolbar from "/lib/component/partial/Toolbar";
import ToolbarMenu from "/lib/component/partial/ToolbarMenu";

const HandlerDetailsToolbar = ({ toolbarItems }) => (
  <Toolbar right={<ToolbarMenu>{toolbarItems({ items: [] })}</ToolbarMenu>} />
);

HandlerDetailsToolbar.propTypes = {
  toolbarItems: PropTypes.func,
};

HandlerDetailsToolbar.defaultProps = {
  toolbarItems: ({ items }) => items,
};

export default HandlerDetailsToolbar;
