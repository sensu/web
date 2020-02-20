import React, { memo } from "/vendor/react";
import { Box, IconButton, Typography } from "/vendor/@material-ui/core";
import { animated, useSpring } from "/vendor/react-spring";
import { AvatarIcon } from "/lib/component/base";
import { PreferencesIcon } from "/lib/component/icon";

import { heights } from "./constants";
import { ToolbarItem } from "./types";

import IconContainer from "./IconContainer";

interface Props {
  accountId?: string;
  isOpen: boolean;
  toolbarItems?: ToolbarItem[];
}

const Footer = ({ accountId, isOpen }: Props) => {
  const labelStyles = useSpring({
    height: isOpen ? heights.toolbar : 0,
    opacity: isOpen ? 1 : 0,
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      height={isOpen ? heights.toolbar : "auto"}
      flexDirection={isOpen ? "row" : "column"}
    >
      <Box
        display={accountId ? "flex" : "none"}
        flexDirection="row"
        alignItems="center"
        width={isOpen ? undefined : heights.button}
      >
        {/* TODO: Replace w/ @dabria's avatar component */}
        <IconContainer icon={<AvatarIcon variant="MONKEY" />} />
      </Box>
      <Box clone display="flex" flexGrow="1" alignItems="center">
        <Typography
          component={animated.p}
          variant="body1"
          color="inherit"
          noWrap
          style={labelStyles}
        >
          {accountId}
        </Typography>
      </Box>
      <IconButton color="inherit">
        <PreferencesIcon />
      </IconButton>
    </Box>
  );
};

export default memo(Footer);
