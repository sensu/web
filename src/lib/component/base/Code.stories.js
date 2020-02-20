import React from "react";
import { storiesOf } from "@storybook/react";
import withTheme from "/lib/storybook/withTheme";
import { Typography } from "/vendor/@material-ui/core";

import Code from "./Code";

storiesOf("lib/base|Code", module)
  .addDecorator(withTheme)
  .add("default", () => (
    <Typography>
      Lorum ipsum
      <Code>
        en-au-ocker: faker: name: # Existing faker field, new data first_name: -
        Charlotte - Ava - Chloe - Emily # New faker fields ocker_first_name: -
        Bazza - Bluey - Davo - Johno - Shano - Shazza region: - South East
        Queensland - Wide Bay Burnett - Margaret River - Port Pirie - Gippsland
        - Elizabeth - Barossa
      </Code>
    </Typography>
  ));
