import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs, text, object } from "@storybook/addon-knobs";
import withTheme from "/lib/storybook/withTheme";

import { Box } from "/vendor/@material-ui/core";
import Chip from "./KeyValueChip";
import ConfigProvider from "/lib/component/util/ConfigurationProvider";

const stories = storiesOf("lib/partial|KeyValueChip", module)
  .addDecorator(withKnobs)
  .addDecorator(fn => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        {fn()}
      </Box>
    );
  })
  .addDecorator(withTheme);

stories.add("simple", () => <Chip name="region" value="us-west-2" />);
stories.add("images", () => (
  <Chip
    name="empire"
    value="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png"
  />
));
stories.add("links", () => (
  <Chip name="search-engine" value="https://www.google.com" />
));
stories.add("long name", () => (
  <Chip name="sensu.io/bonsai/aws-aggregate-viewer-policy" value="enabled" />
));
stories.add("long value", () => (
  <Chip
    name="my-json"
    value={`
      {"chip": true, "more": false, "pages": true, "number": 123, "duck": ["jonathan"]}
    `}
  />
));
stories.add("custom", () => (
  <Chip name={text("name", "some-name")} value={text("value", "some-value")} />
));
stories.add("link-policy", () => {
  const policy = object("policy", {
    linkPolicy: {
      allowList: true,
      URLs: ["https://*google*"],
    },
  });
  return (
    <ConfigProvider state={policy}>
      <Chip
        name="with-policy"
        value={text("value", "https://www.semver.org")}
      />
    </ConfigProvider>
  );
});
