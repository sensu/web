import React from "react";

import { storiesOf } from "@storybook/react";
import withTheme from "/lib/storybook/withTheme";

import { Box, Card, CardContent, Typography } from "/vendor/@material-ui/core";
import Skeleton from "./Skeleton";

const stories = storiesOf("lib/base|Skeleton", module)
  .addDecorator(fn => {
    return (
      <Box alignItems="center" justifyContent="center">
        <Card
          style={{
            minHeight: 480,
            width: 480,
          }}
        >
          <CardContent>{fn()}</CardContent>
        </Card>
      </Box>
    );
  })
  .addDecorator(withTheme);

stories.add("text", () => (
  <React.Fragment>
    <Typography variant="h3" paragraph>
      <Skeleton variant="text">Local Man is Invisible!</Skeleton>
    </Typography>
    <Typography variant="overline" paragraph>
      <Skeleton variant="text">Subtitle</Skeleton>
    </Typography>
    <Typography paragraph>
      <Skeleton variant="text">
        text text text
        text text text
        text text text
        text text text
        text text text
        text text text
      </Skeleton>
    </Typography>
  </React.Fragment>
));
