import React from "/vendor/react";
import { CardContent, Typography } from "/vendor/@material-ui/core";

const ContextSwitcherListEmpty = () => {
  return (
    <CardContent>
      <Typography variant="body2" paragraph align="center">
        Unable to find any namespaces.
      </Typography>
      <Typography variant="body2" align="center">
        Please contact an administrator to ensure that you have permission to at
        least one namespace.
      </Typography>
    </CardContent>
  );
};

export default ContextSwitcherListEmpty;
