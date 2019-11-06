import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text } from "@storybook/addon-knobs";
import withTheme from "/lib/storybook/withTheme";

import { Button } from "/vendor/@material-ui/core";

import Banner from "./Banner";

storiesOf("lib/base|Banner", module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add("no variant", () => (
    <Banner
      message={text("message", "This is my story")}
      actions={<Button variant="inherit">OK</Button>}
    />
  ))
  .add("info", () => (
    <Banner
      message={text("message", "This is my story")}
      actions={<Button variant="inherit">OK</Button>}
      variant="info"
    />
  ))
  .add("success", () => (
    <Banner
      message={text("message", "This is my story")}
      actions={<Button variant="inherit">OK</Button>}
      variant="success"
    />
  ))
  .add("warning", () => (
    <Banner
      message={text("message", "Warning: contents may explode.")}
      actions={<Button variant="inherit">OK</Button>}
      variant="warning"
    />
  ))
  .add("error", () => (
    <Banner
      message={text("message", "This is my story")}
      actions={<Button variant="inherit">OK</Button>}
      variant="error"
    />
  ));
