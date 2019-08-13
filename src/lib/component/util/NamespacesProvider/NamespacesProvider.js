import React from "/vendor/react";
import PropTypes from "prop-types";

import Context from "./context";

const NamespacesProvider = ({ namespaces, children }) => {
  return <Context.Provider value={namespaces}>{children}</Context.Provider>;
};

NamespacesProvider.propTypes = {
  children: PropTypes.node,
  namespaces: PropTypes.array,
};

export default NamespacesProvider;
