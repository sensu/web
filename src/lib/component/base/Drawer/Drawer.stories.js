import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import withTheme from "/lib/storybook/withTheme";

import { NamespaceIcon } from "/lib/component/partial";
import {
  EventIcon,
  EntityIcon,
  KeyboardArrowDownIcon,
  SelectIcon,
  ConfigIcon,
  SilenceIcon,
} from "/lib/component/icon";
import { MonkeyAvatar } from "/lib/component/icon/avatar";

import Banner from "./Drawer";

storiesOf("lib/base|Drawer", module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add("full", () => (
    <Banner
      nav={text("message", "This is my story")}
      links={[
        {
          id: "home",
          href: "/home",
          icon: <NamespaceIcon namespace={{ name: "sensu-staging" }} />,
          contents: "sensu-staging",
          adornment: <SelectIcon />,
        },
        {
          id: "events",
          href: "/events",
          icon: <EventIcon />,
          contents: "Events",
        },
        {
          id: "entities",
          href: "/home",
          icon: <EntityIcon />,
          contents: "Entities",
        },
        {
          id: "silences",
          href: "/silences",
          icon: <SilenceIcon />,
          contents: "Silences",
        },
        {
          id: "config",
          href: "/home",
          icon: <ConfigIcon />,
          contents: "Configuration",
          adornment: <KeyboardArrowDownIcon />,
        },
      ]}
      username={text("username", "dabria")}
      variant={select("variant", ["full", "min"], "full")}
    />
  ))
  .add("collapsed", () => {
    const [open, toggle] = React.useState(false);
    const namespace = text("namespace", "sensu-staging");

    return (
      <Banner
        links={[
          {
            id: "home",
            href: "/home",
            icon: <NamespaceIcon namespace={{ name: namespace }} />,
            contents: namespace,
            adornment: <SelectIcon />,
          },
          {
            id: "events",
            href: "/events",
            icon: <EventIcon />,
            contents: "Events",
          },
          {
            id: "entities",
            href: "/home",
            icon: <EntityIcon />,
            contents: "Entities",
          },
          {
            id: "silences",
            href: "/silences",
            icon: <SilenceIcon />,
            contents: "Silences",
          },
          {
            id: "config",
            href: "/home",
            icon: <ConfigIcon />,
            contents: "Configuration",
            adornment: <KeyboardArrowDownIcon />,
          },
        ]}
        userId={text("userId", "dabria")}
        userAvatar={<MonkeyAvatar />}
        variant={open ? "full" : "min"}
        onToggle={() => toggle(!open)}
      />
    );
  });
