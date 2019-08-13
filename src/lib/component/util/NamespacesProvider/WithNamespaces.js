import React from "/vendor/react";

import Context from "./context";

const WithNamespaces = props => <Context.Consumer {...props} />;

export default WithNamespaces;
