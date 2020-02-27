import React, { memo } from "/vendor/react";
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
} from "/vendor/@material-ui/core";
import { animated, useSpring } from "/vendor/react-spring";
import { UserAvatar } from "/lib/component/partial";

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
      <Tooltip
        title={
          <span>
            Authenticated as <em>{accountId}</em>
          </span>
        }
        open={isOpen ? false : undefined}
        placement="right"
      >
        <Box
          display={accountId ? "flex" : "none"}
          flexDirection="row"
          alignItems="center"
          width={isOpen ? undefined : heights.button}
        >
          <IconContainer icon={<UserAvatar username={accountId || ""} />} />
        </Box>
      </Tooltip>
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
      {toolbarItems.map(({ id, hint, icon, onClick }) => (
        <Tooltip
          key={id}
          title={hint}
          open={!hint ? false : undefined}
          placement="right"
        >
          <IconButton color="inherit" onClick={onClick}>
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default memo(Footer);
