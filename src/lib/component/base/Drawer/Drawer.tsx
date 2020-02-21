import React, { useState, useCallback } from "/vendor/react";
import { useTheme, Box, IconButton, Modal } from "/vendor/@material-ui/core";
import { animated, useSpring } from "/vendor/react-spring";
import { SensuWordmark } from "/lib/component/base";
import { MenuIcon } from "/lib/component/icon";

import { widths, heights } from "./constants";
import { MenuItem as MenuItemType } from "./types";

import Footer from "./Footer";
import HorizontalRule from "./HorizontalRule";
import MenuItem from "./MenuItem";

// TODO: Move into the theme somewhere?
const silver = "rgb(213, 214, 221)";

interface Props {
  // Unique identifier for the account that is currently authenticated.
  accountId: string;

  // Contents of the title toolbar
  title?: React.ReactElement;

  // Drawer may be one of three variants.
  //   Full: has width of 224dp; has no expanded state
  //   Mini: has width of 64dp; can be expanded into 224dp state, appears over top of content.
  //   Hidden: has no width; can be expanded into 224dp state, appears over top of content.
  variant: "full" | "mini" | "hidden";

  // When true and used with mini and hidden variants, full drawer is rendered.
  expanded: boolean;

  // List of links and groups of links that will appear in the drawer.
  links: MenuItemType[];

  // Is triggered when the user presses the menu icon or clicks a folder from collapsed state.
  onToggle: () => void;

  // Is triggered when the user explicitly closes the drawer from expanded state.
  onClose: () => void;
}

const Drawer = ({
  title,
  links,
  accountId,
  variant,
  expanded,
  onClose,
  onToggle,
}: Props) => {
  const isOpen = !!expanded || variant === "full";

  const [openIdx, setOpenIdxState] = useState<string | null>(null);
  const setOpenIdx = useCallback(
    (val) => {
      if (!isOpen) {
        onToggle();
        setOpenIdxState(val);
      } else {
        setOpenIdxState(openIdx !== val ? val : null);
      }
    },
    [setOpenIdxState, onToggle, openIdx, isOpen],
  );

  const theme = useTheme();
  const color = isOpen ? theme.palette.text.primary : silver;
  const width = isOpen ? widths.full : variant === "mini" ? widths.mini : 0;
  const bgColor = isOpen ? theme.palette.background.default : "#2D3555"; // ???
  const styles = useSpring({
    color,
    width,
    backgroundColor: bgColor,
    outline: 0,
  });

  const drawer = (
    <Box
      component={animated.div}
      height="100vh"
      position="fixed"
      style={styles}
      flexDirection="column"
      padding={1}
      display="flex"
      overflow="hidden"
    >
      <Box display="flex" alignItems="center" height={heights.toolbar}>
        <IconButton color="inherit" onClick={onToggle}>
          <MenuIcon />
        </IconButton>{" "}
        <Box component="span" marginLeft={1}>
          {title || <SensuWordmark fontSize="inherit" />}
        </Box>
      </Box>

      <HorizontalRule color={color} />

      <Box
        component="ul"
        display="flex"
        flexGrow={1}
        flexDirection="column"
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        {links.map((linkProps) => (
          <MenuItem
            {...linkProps}
            key={linkProps.id}
            collapsed={!isOpen}
            expanded={isOpen && openIdx === linkProps.id}
            onExpand={() => setOpenIdx(linkProps.id) /* TODO: move to child? */}
            onClick={() => {
              if (linkProps.onClick) {
                linkProps.onClick();
              }
              onClose();
            }}
          />
        ))}
      </Box>

      <HorizontalRule color={color} />

      <Footer accountId={accountId} isOpen={isOpen} />
    </Box>
  );

  if (variant === "mini" && expanded) {
    return (
      <React.Fragment>
        <Box width={widths.mini} flex="0 0 auto" />
        <Modal disableAutoFocus onClose={onClose} open>
          {drawer}
        </Modal>
      </React.Fragment>
    );
  }

  if (variant === "hidden") {
    return (
      <Modal disableAutoFocus keepMounted onClose={onClose} open={expanded}>
        {drawer}
      </Modal>
    );
  }

  return (
    <React.Fragment>
      <Box component={animated.div} style={{ width }} flex="0 0 auto" />
      {drawer}
    </React.Fragment>
  );
};

export default Drawer;
