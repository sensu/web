import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, number } from "@storybook/addon-knobs";
import withTheme from "/lib/storybook/withTheme";

import Icon from "./CheckStatusIcon";

storiesOf("lib/base|CheckStatusIcon", module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add("ok", () => (
    <Icon
      statusCode={0}
      inline={boolean("small", false)}
      mutedOK={boolean("muted", false)}
      small={boolean("small", false)}
      silenced={boolean("silenced", false)}
    />
  ))
  .add("warning", () => (
    <Icon
      statusCode={1}
      inline={boolean("small", false)}
      mutedOK={boolean("muted", false)}
      small={boolean("small", false)}
      silenced={boolean("silenced", false)}
    />
  ))
  .add("critical", () => (
    <Icon
      statusCode={2}
      inline={boolean("small", false)}
      mutedOK={boolean("muted", false)}
      small={boolean("small", false)}
      silenced={boolean("silenced", false)}
    />
  ))
  .add("unknown", () => (
    <Icon
      statusCode={127}
      inline={boolean("small", false)}
      mutedOK={boolean("muted", false)}
      small={boolean("small", false)}
      silenced={boolean("silenced", false)}
    />
  ))
  .add("inline", () => <Icon inline statusCode={number("status", 0)} />)
  .add("muted", () => <Icon mutedOK statusCode={number("status", 0)} />)
  .add("small", () => <Icon small statusCode={number("status", 0)} />)
  .add("silenced", () => (
    <Icon
      silenced
      statusCode={number("status", 0)}
      inline={boolean("small", false)}
      small={boolean("small", false)}
      mutedOK={boolean("muted", false)}
    />
  ));
