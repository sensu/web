import React from "react";
import PropTypes from "prop-types";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import withTheme from "/lib/storybook/withTheme";

import {
  AppBar,
  Box,
  Button,
  IconButton,
  Grid,
  Paper,
  Toolbar,
} from "/vendor/@material-ui/core";
import { NamespaceIcon } from "/lib/component/partial";
import {
  ConfigIcon,
  EventIcon,
  EntityIcon,
  MenuIcon,
  SelectIcon,
  SilenceIcon,
} from "/lib/component/icon";

import Drawer from "./Drawer";

const ExampleCard = () => {
  return (
    <Paper>
      <Box
        display="flex"
        height="10rem"
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="contained">Button</Button>
      </Box>
    </Paper>
  );
};

const ExampleGrid = ({ drawer }) => {
  return (
    <Box display="flex" flexDirection="row" flexGrow="1">
      {drawer}
      <Box margin={2}>
        <Grid container spacing={3}>
          <Grid item xs="12">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="6">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="6">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="6">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="6">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="4">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="4">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="4">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="3">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="3">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="3">
            <ExampleCard />
          </Grid>
          <Grid item xs="12" sm="3">
            <ExampleCard />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

ExampleGrid.propTypes = {
  drawer: PropTypes.node,
};

storiesOf("lib/base|Drawer", module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add("playground", () => {
    return (
      <ExampleGrid
        drawer={
          <Drawer
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
                icon: <ConfigIcon />,
                contents: "Configuration",
                links: [
                  {
                    id: "checks",
                    href: "/checks",
                    contents: "Checks",
                  },
                  {
                    id: "filters",
                    href: "/filters",
                    contents: "Filters",
                  },
                  {
                    id: "handlers",
                    href: "/handlers",
                    contents: "Handlers",
                  },
                  {
                    id: "mutators",
                    href: "/mutators",
                    contents: "Mutators",
                  },
                ],
              },
            ]}
            accountId={text("username", "dabria")}
            variant={select("variant", ["full", "mini", "hidden"], "full")}
            onToggle={action("on-toggle-pressed")}
          />
        }
      />
    );
  })
  .add("full", () => {
    const [open, setOpen] = React.useState(true);
    const onToggleNotifier = action("toggle-button-press");
    const onToggle = React.useCallback(() => {
      onToggleNotifier();
      setOpen(!open);
    }, [onToggleNotifier, open, setOpen]);

    return (
      <ExampleGrid
        drawer={
          <Drawer
            links={[
              {
                id: "home",
                icon: <NamespaceIcon namespace={{ name: "sensu-staging" }} />,
                contents: "sensu-staging",
                adornment: <SelectIcon />,
                hint: "Switch Namespace",
                onClick: action("namespace-item-press"),
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
                icon: <ConfigIcon />,
                contents: "Configuration",
                links: [
                  {
                    id: "checks",
                    href: "/checks",
                    contents: "Checks",
                  },
                  {
                    id: "filters",
                    href: "/filters",
                    contents: "Filters",
                  },
                  {
                    id: "handlers",
                    href: "/handlers",
                    contents: "Handlers",
                  },
                  {
                    id: "mutators",
                    href: "/mutators",
                    contents: "Mutators",
                  },
                ],
              },
            ]}
            accountId={text("username", "dabria")}
            variant={open ? "full" : "mini"}
            onToggle={onToggle}
          />
        }
      />
    );
  })
  .add("mini", () => {
    const [open, setOpen] = React.useState(false);
    const namespace = text("namespace", "sensu-staging");

    return (
      <ExampleGrid
        drawer={
          <Drawer
            links={[
              {
                id: "home",
                icon: <NamespaceIcon namespace={{ name: namespace }} />,
                contents: namespace,
                adornment: <SelectIcon />,
                hint: "Switch Namespace",
                onClick: () => alert("changing"),
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
                icon: <ConfigIcon />,
                contents: "Configuration",
                links: [
                  {
                    id: "checks",
                    href: "/checks",
                    contents: "Checks",
                  },
                  {
                    id: "filters",
                    href: "/filters",
                    contents: "Filters",
                  },
                  {
                    id: "handlers",
                    href: "/handlers",
                    contents: "Handlers",
                  },
                  {
                    id: "mutators",
                    href: "/mutators",
                    contents: "Mutators",
                  },
                ],
              },
            ]}
            accountId={text("userId", "dabria")}
            variant={"mini"}
            expanded={open}
            onToggle={() => {
              action("toggle-press")();
              setOpen(!open);
            }}
            onClose={() => {
              action("close-press")();
              setOpen(false);
            }}
          />
        }
      />
    );
  })
  .add("hidden", () => {
    const [open, setOpen] = React.useState(false);
    const namespace = text("namespace", "sensu-staging");

    return (
      <Box display="flex" flexDirection="column">
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => {
                action("menu-press")();
                setOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <ExampleGrid
          drawer={
            <Drawer
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
                  icon: <ConfigIcon />,
                  contents: "Configuration",
                  links: [
                    {
                      id: "checks",
                      href: "/checks",
                      contents: "Checks",
                    },
                    {
                      id: "filters",
                      href: "/filters",
                      contents: "Filters",
                    },
                    {
                      id: "handlers",
                      href: "/handlers",
                      contents: "Handlers",
                    },
                    {
                      id: "mutators",
                      href: "/mutators",
                      contents: "Mutators",
                    },
                  ],
                },
              ]}
              accountId={text("userId", "dabria")}
              variant={"hidden"}
              expanded={open}
              onToggle={() => {
                action("toggle-press")();
                setOpen(!open);
              }}
              onClose={() => {
                action("close-press")();
                setOpen(false);
              }}
            />
          }
        />
      </Box>
    );
  });
