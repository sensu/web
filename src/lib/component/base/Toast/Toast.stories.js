import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, text, select } from "@storybook/addon-knobs";

import withTheme from "/lib/storybook/withTheme";
import { LinearProgress } from "/vendor/@material-ui/core";
import Toast from "./Toast";

storiesOf("lib/base|Toast", module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add("success", () => (
    <Toast message={text("Message", "Wowee!")} variant="success" />
  ))
  .add("warning", () => (
    <Toast message={text("Message", "Oh golly.")} variant="warning" />
  ))
  .add("error", () => (
    <Toast message={text("Message", "Fudge.")} variant="error" />
  ))
  .add("info", () => (
    <Toast message={text("Message", "🤓 did you know...")} variant="info" />
  ))
  .add("progress", () => (
    <Toast
      message={text("Message", "Reticulating splines.")}
      variant="info"
      progress={boolean("In progress", true) ? <LinearProgress /> : null}
    />
  ))
  .add("maxAge", () => {
    return (
      <Toast
        message={text("Message", "has max age...")}
        variant={select("Variant", ["success", "info", "error", "warning"])}
        showAgeIndicator
        maxAge={10000}
      />
    );
  });
