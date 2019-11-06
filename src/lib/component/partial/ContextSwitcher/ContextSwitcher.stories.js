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
      { name: "sensu", clusters: ["cluster-xx-yyy-z"] },
      { name: "sensu-demo", clusters: ["cluster-xx-yyy-z"] },
      { name: "banana/stand", clusters: ["cluster-xx-yyy-z"] },
      { name: "foo", clusters: ["cluster-xx-yyy-z"] },
      { name: "baz", clusters: ["cluster-xx-yyy-z"] },
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
      { name: "sensu", clusters: ["0b1f3e8-f8e", "aac31f-f17"] },
      { name: "sensu-demo", clusters: ["0b1f3e8-f8e"] },
      { name: "banana/stand", clusters: ["0b1f3e8-f8e", "aac31f-f17"] },
      { name: "us-west-2", clusters: ["88eb1f-e33-0"] },
      { name: "us-east-1", clusters: ["88eb1f-e33-1"] },
      { name: "???", clusters: ["88eb1f-e33-0", "aac31f-f17"] },
      { name: "acme", clusters: ["88eb1f-e33-0"] },
      { name: "sensu-devel", clusters: ["aac31f-f17"] },
      { name: "contoso", clusters: ["aac31f-f17"] },
      { name: "foo", clusters: ["0b1f3e8-f8e", "88eb1f-e33-1"] },
      { name: "bar", clusters: ["88eb1f-e33-1"] },
      { name: "baz", clusters: ["0b1f3e8-f8e", "88eb1f-e33-1"] },
    ]}
  />
));
