import React from "/vendor/react";
import { withStyles } from "/vendor/@material-ui/core";

import reset from "./reset.css";

class ResetStyles extends React.PureComponent {
  render() {
    return null;
  }
}

export default withStyles({ "@global": reset })(ResetStyles);
