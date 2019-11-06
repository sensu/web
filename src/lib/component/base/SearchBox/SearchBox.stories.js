import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, text, select } from "@storybook/addon-knobs";

import { Box, Card } from "/vendor/@material-ui/core";
import withTheme from "/lib/storybook/withTheme";
import SearchBox from "./SearchBox";

const stories = storiesOf("lib/base|SearchBox", module)
  .addDecorator(withKnobs)
  .addDecorator(fn => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ height: "50vw" }}
    >
      <Card style={{ width: "80vw", minWidth: 320 }}>
        <Box display="flex">{fn()}</Box>
      </Card>
    </Box>
  ))
  .addDecorator(withTheme);

stories.add("empty", () => (
  <Box flexGrow={boolean("Full width", true) ? "1" : "0"}>
    <SearchBox
      placeholder={text("Placeholder", "Search for events...")}
      variant={select("Variant", ["search", "filter"])}
    />
  </Box>
));

stories.add("input", () => (
  <Box flexGrow={boolean("Full width", true) ? "1" : "0"}>
    <SearchBox
      placeholder={text("Placeholder", "Search for events...")}
      value="something or other"
    />
  </Box>
));

stories.add("state", () => {
  const [value, setValue] = useState("");

  return (
      <SearchBox
        placeholder={text("Placeholder", "Search for events...")}
        value={value}
        onChange={ev => setValue(ev.currentTarget.value)}
      />
  );
});

stories.add("test", () => {
  const [value, setValue] = useState("");

  return (
    <input
      type="search"
      placeholder={text("Placeholder", "Search for events...")}
      value={value}
      onChange={ev => setValue(ev.currentTarget.value)}
    />
  );
});
