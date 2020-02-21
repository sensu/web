import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import withTheme from "/lib/storybook/withTheme";

import { Box } from "/vendor/@material-ui/core";
import { UserAvatar } from "/lib/component/partial/UserAvatar/UserAvatar";

const stories = storiesOf("lib/partial|UserAvatar", module)
  .addDecorator(withKnobs)
  .addDecorator(fn => {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box display="flex">{fn()}</Box>
      </Box>
    );
  })
  .addDecorator(withTheme);

stories.add("UserAvatar", () => {
  return <UserAvatar username="dabria" />;
});
