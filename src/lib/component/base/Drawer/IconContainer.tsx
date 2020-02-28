import React from "/vendor/react";
import { Box } from "/vendor/@material-ui/core";

interface Props {
  icon?: React.ReactElement;
}

const IconContainer = ({ icon }: Props) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      width={48}
      height={48}
    >
      {icon || <Box />}
    </Box>
  );
};

export default IconContainer;
