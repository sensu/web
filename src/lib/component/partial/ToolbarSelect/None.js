import React from "/vendor/react";
import { Box } from "/vendor/@material-ui/core";

import Option from "./Option";

const None = (props) => (
  <Option {...props}>
    <Box component="em" fontStyle="italic">
      None
    </Box>
  </Option>
);

export default None;
