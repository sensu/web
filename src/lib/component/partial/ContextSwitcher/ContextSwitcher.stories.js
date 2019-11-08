import React, { useMemo } from "react";
import times from "lodash/times";

import { storiesOf } from "@storybook/react";
import { withKnobs, boolean, number, text } from "@storybook/addon-knobs";
import { getName } from "/lib/storybook/withData";
import withTheme from "/lib/storybook/withTheme";

import { Dialog, Fade } from "/vendor/@material-ui/core";
import ContextSwitcher from "./ContextSwitcher";

const FadeIn = props => <Fade in {...props} />;

const stories = storiesOf("lib/partial|ContextSwitcher", module)
  .addDecorator(withKnobs)
  .addDecorator(fn => {
    const touch = boolean("touch", false);
    const fullScreen = boolean("fullscreen", false);
    const dense = !touch;
    const hideKeyHints = touch;

    return (
      <Dialog
        open
        TransitionComponent={FadeIn}
        fullScreen={fullScreen}
        fullWidth={fullScreen}
        PaperProps={{
          style: !fullScreen
            ? {
                minHeight: 400,
                maxHeight: 448,
                width: 320,
              }
            : {},
        }}
      >
        {fn({ props: { dense, hideKeyHints } })}
      </Dialog>
    );
  })
  .addDecorator(withTheme);

stories.add("loading", ({ props }) => <ContextSwitcher {...props} loading />);

stories.add("empty", ({ props }) => <ContextSwitcher {...props} />);

stories.add("no clusters", ({ props }) => (
  <ContextSwitcher
    {...props}
    namespaces={[
      { name: "sensu" },
      { name: "sensu-demo" },
      { name: "banana/stand" },
      { name: "foo" },
      { name: "baz" },
    ]}
  />
));

stories.add("no clusters; many namespaces", ({ props }) => {
  const num = number("number of records", 50);
  const seed = text("random number generator seed", "15158");

  const names = useMemo(() => times(num).map(i => getName(`${seed}${i}`)), [
    num,
    seed,
  ]);
  return (
    <ContextSwitcher {...props} namespaces={names.map(name => ({ name }))} />
  );
});

stories.add("one cluster", ({ props }) => (
  <ContextSwitcher
    {...props}
    clusters={[{ name: "cluster-xx-yyy-z" }]}
    namespaces={[
      { name: "sensu", cluster: "cluster-xx-yyy-z" },
      { name: "sensu-demo", cluster: "cluster-xx-yyy-z" },
      { name: "banana/stand", cluster: "cluster-xx-yyy-z" },
      { name: "foo", cluster: "cluster-xx-yyy-z" },
      { name: "baz", cluster: "cluster-xx-yyy-z" },
    ]}
  />
));

stories.add("many clusters", ({ props }) => (
  <ContextSwitcher
    {...props}
    clusters={[
      { name: "0b1f3e8-f8e" },
      { name: "88eb1f-e33-0" },
      { name: "88eb1f-e33-1" },
      { name: "aac31f-f17" },
    ]}
    namespaces={[
      { name: "sensu", cluster: "0b1f3e8-f8e" },
      { name: "sensu", cluster: "aac31f3-f17" },
      { name: "sensu-demo", cluster: "0b1f3e8-f8e" },
      { name: "banana/stand", cluster: "0b1f3e8-f8e" },
      { name: "banana/stand", cluster: "aac31f3-f17" },
      { name: "us-west-2", cluster: "88eb1f7-e33-0" },
      { name: "us-east-1", cluster: "88eb1f7-e33-1" },
      { name: "???", cluster: "88eb1f7-e33-0" },
      { name: "???", cluster: "aac31f3-f17" },
      { name: "acme", cluster: "88eb1f7-e33-0" },
      { name: "sensu-devel", cluster: "aac31f3-f17" },
      { name: "contoso", cluster: "aac31f3-f17" },
      { name: "foo", cluster: "0b1f3e8-f8e" },
      { name: "foo", cluster: "88eb1f7-e33-1" },
      { name: "bar", cluster: "88eb1f7-e33-1" },
      { name: "baz", cluster: "0b1f3e8-f8e" },
      { name: "baz", cluster: "88eb1f7-e33-1" },
    ]}
  />
));
