import React from "react";
import { Card, CardContent, Typography } from "/vendor/@material-ui/core";
import { Skeleton } from "/lib/component/base";

const LoadingCard = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" paragraph>
          <Skeleton variant="text">A Fantastic Title</Skeleton>
        </Typography>
        <Typography variant="body1">
          <Skeleton variant="text">Lorum ipsum is boring but idk...</Skeleton>
        </Typography>
        <Typography variant="body1">
          <Skeleton variant="text">
            Lorum ipsum is boring but I cannot think of anything else to type.
          </Skeleton>
        </Typography>
        <Typography variant="body1">
          <Skeleton variant="text">Okay. Out of ideas.</Skeleton>
        </Typography>
        <Typography variant="body1">
          <Skeleton variant="text">Lorum ipsum is ipsum but idk...</Skeleton>
        </Typography>
        <Typography variant="body1">
          <Skeleton variant="text">
            Lorum ipsum is boring but I cannot think of anyth...
          </Skeleton>
        </Typography>
        <Typography variant="body1">
          <Skeleton variant="text">Okay. Out of ideas.</Skeleton>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
