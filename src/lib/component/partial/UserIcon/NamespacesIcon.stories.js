import React from "react";

import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import withTheme from "/lib/storybook/withTheme";

import {
  Box,
  Typography,
  Table,
  TableRow,
  TableCell,
} from "/vendor/@material-ui/core";
import Icon, { icons, colours } from "./Icon";

const stories = storiesOf("lib/partial|NamespaceIcon", module)
  .addDecorator(withKnobs)
  .addDecorator(fn => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box display="flex">{fn()}</Box>
      </Box>
    );
  })
  .addDecorator(withTheme);

stories.add("table", () => {
  return (
    <Table>
      {Object.keys(icons).map(icon => (
        <TableRow key={icon}>
          <TableCell>
            <Typography color="textPrimary">{icon}</Typography>
          </TableCell>
          <TableCell>
            {Object.keys(colours).map(colour => (
              <React.Fragment key={colour}>
                <Icon icon={icon} colour={colour} />{" "}
              </React.Fragment>
            ))}
          </TableCell>
          <TableCell>
            <Icon icon={icon} colour={"ORANGE"} size={16} />
          </TableCell>
          <TableCell>
            <Icon icon={icon} colour={"ORANGE"} size={32} />
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
});
