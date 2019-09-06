import React from "react";
import { CardContent, Typography } from "/vendor/@material-ui/core";

const ContextSwitcherListEmpty = () => {
  return (
    <CardContent>
      <Typography variant="body2" paragraph align="center">
        No Results
      </Typography>
      <Typography variant="body2" align="center">
        Sensu could not find any namespaces or clusters matching your query.
        Please check for typos and ensure you have access to the resource you
        are trying to find.
      </Typography>
    </CardContent>
  );
};

export default ContextSwitcherListEmpty;
