import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, number, select } from "@storybook/addon-knobs";
import IntlRelativeFormat from "intl-relativeformat";

import { Typography } from "@material-ui/core";
import withTheme from "/lib/storybook/withTheme";
import RelativeDate from "./RelativeDate";

window.IntlRelativeFormat = IntlRelativeFormat;

storiesOf("lib/base|RelativeDate", module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add("seconds", () => {
    const d1 = new Date();
    d1.setHours(13);

    return (
      <Typography color="textPrimary">
        <RelativeDate
          dateTime={d1.toUTCString()}
          to={d1}
          capitalize={boolean("capitalize", true)}
          precision="seconds"
        />
      </Typography>
    );
  })
  .add("default", () => {
    const d1 = new Date();
    d1.setSeconds(0);

    const d2 = new Date();
    d2.setSeconds(0);
    d2.setSeconds(number("offset", 5));

    return (
      <Typography color="textPrimary">
        <RelativeDate
          dateTime={d1.toUTCString()}
          to={d2}
          capitalize={boolean("capitalize", true)}
          style={select("style", ["best fit", "numeric"])}
        />
      </Typography>
    );
  });
