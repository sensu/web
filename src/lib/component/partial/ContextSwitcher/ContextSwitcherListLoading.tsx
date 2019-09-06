import React from "react";
import { Box, List, ListSubheader } from "/vendor/@material-ui/core";
import ContextSwitcherListItem from "./ContextSwitcherListItem";

interface GlowTypographyProps {
  children: string;
}

const GlowTypography = ({ children }: GlowTypographyProps) => {
  return (
    <Box
      clone
      bgcolor="text.primary"
      style={{
        color: "transparent",
        cursor: "progress",
        opacity: 0.25,
        userSelect: "none",
      }}
    >
      <span>{children}</span>
    </Box>
  );
};

const GlowIcon = () => {
  return (
    <Box
      bgcolor="text.primary"
      style={{
        cursor: "progress",
        opacity: 0.25,
        userSelect: "none",
        width: 24,
        height: 24,
      }}
    />
  );
};

const ContextSwitcherListLoading = () => {
  return (
    <React.Fragment>
      <List
        subheader={
          <ListSubheader>
            <GlowTypography>my-local-cluster</GlowTypography>
          </ListSubheader>
        }
      >
        <ContextSwitcherListItem
          icon={<GlowIcon />}
          name={<GlowTypography>namesace-xxx-yyy</GlowTypography>}
          decoration={<GlowIcon />}
        />
        <ContextSwitcherListItem
          icon={<GlowIcon />}
          name={<GlowTypography>namesace-z</GlowTypography>}
          decoration={<GlowIcon />}
        />
        <ContextSwitcherListItem
          icon={<GlowIcon />}
          name={<GlowTypography>namesace-xyz-0</GlowTypography>}
          decoration={<GlowIcon />}
        />
      </List>
      <List
        subheader={
          <ListSubheader>
            <GlowTypography>some-other-cluster</GlowTypography>
          </ListSubheader>
        }
      >
        <ContextSwitcherListItem
          icon={<GlowIcon />}
          name={<GlowTypography>namesace-xxx-yyy</GlowTypography>}
          decoration={<GlowIcon />}
        />
      </List>
    </React.Fragment>
  );
};

export default ContextSwitcherListLoading;
