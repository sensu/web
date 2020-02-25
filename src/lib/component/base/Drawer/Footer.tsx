import React, { memo } from "/vendor/react";
import { Box, IconButton, Typography } from "/vendor/@material-ui/core";
import { animated, useSpring } from "/vendor/react-spring";
import AvatarIcon, { Avatar } from "../AvatarIcon";

import { heights } from "./constants";
import { ToolbarItemConfig } from "./types";

import IconContainer from "./IconContainer";

interface Props {
  accountId?: string;
  isOpen: boolean;
  toolbarItems?: ToolbarItemConfig[];
}

const Footer = ({ accountId, toolbarItems = [], isOpen }: Props) => {
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
        <IconContainer icon={<AvatarIcon variant={Avatar.MONKEY} />} />
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
      {toolbarItems.map(({ id, icon, onClick }) => (
        <IconButton key={id} color="inherit" onClick={onClick}>
          {icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default memo(Footer);
