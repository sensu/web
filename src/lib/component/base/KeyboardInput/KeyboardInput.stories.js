import React from "react";

import { storiesOf } from "@storybook/react";
import withTheme from "/lib/storybook/withTheme";

import { Card, CardContent, Typography } from "/vendor/@material-ui/core";
import KeyboardInput from "./KeyboardInput";

const stories = storiesOf("lib/base|KeyboardInput", module)
  .addDecorator(fn => {
    return (
      <Card
        style={{
          minHeight: 200,
          width: 320,
        }}
      >
        <CardContent>{fn()}</CardContent>
      </Card>
    );
  })
  .addDecorator(withTheme);

stories.add("with keycode", () => (
  <React.Fragment>
    <Typography variant="h6" paragraph>Demo</Typography>
    <Typography paragraph>
      Please press <KeyboardInput>Cmd</KeyboardInput> +{" "}
      <KeyboardInput>R</KeyboardInput> to re-render any page in this storybook.
    </Typography>
    <Typography>
      Press <KeyboardInput>⌘</KeyboardInput> + <KeyboardInput>⇧</KeyboardInput>{" "}
      + <KeyboardInput>,</KeyboardInput> for hintsheet.
    </Typography>
  </React.Fragment>
));
