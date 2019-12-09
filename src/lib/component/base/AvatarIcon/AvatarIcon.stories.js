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
import Icon, { Avatar, AvatarColor } from "./AvatarIcon";

const stories = storiesOf("lib/base|AvatarIcon", module)
  .addDecorator(withKnobs)
  .addDecorator(fn => {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box display="flex">{fn()}</Box>
      </Box>
    );
  })
  .addDecorator(withTheme);

stories.add("table", () => {
  return (
    <Table>
      {Object.keys(Avatar).map(variant => (
        <TableRow key={variant}>
          <TableCell>
            <Typography color="textPrimary">{Avatar[variant]}</Typography>
          </TableCell>
          <TableCell>
            <Typography color="textPrimary">
              {Object.values(AvatarColor).map(color => (
                <React.Fragment key={color}>
                  <Icon variant={variant} color={color} />{" "}
                </React.Fragment>
              ))}
            </Typography>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
});
