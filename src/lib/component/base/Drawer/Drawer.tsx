import React, { useCallback, useContext, useState } from "/vendor/react";
import {
  useTheme,
  Box,
  IconButton,
  Modal,
  Tooltip,
} from "/vendor/@material-ui/core";
import { animated, useSpring } from "/vendor/react-spring";
import { MenuIcon } from "/lib/component/icon";
import LayoutContext from "../AppLayout/Context";

import { widths, heights } from "./constants";
import { MenuItemConfig, LinkConfig, ToolbarItemConfig } from "./types";

import Footer from "./Footer";
import HorizontalRule from "./HorizontalRule";
import MenuItem from "./MenuItem";
import SensuWordmark from "../SensuWordmark";

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
  links: MenuItemConfig[];

  // List of actions that will appear in toolbar.
  toolbarItems: ToolbarItemConfig[];

  // Is triggered when the user presses the menu icon or clicks a folder from collapsed state.
  onToggle: () => void;

  // Is triggered when the user explicitly closes the drawer from expanded state.
  onClose: () => void;

  // Is triggered when the drawer is in it's mini variant and a folder is expanded.
  onTempExpand: () => void;
}

const Drawer = ({
  title,
  links,
  toolbarItems,
  accountId,
  variant,
  expanded,
  onClose,
  onToggle,
  onTempExpand,
}: Props) => {
  const isOpen = !!expanded || variant === "full";

  const { topBarHeight } = useContext(LayoutContext);

  const [openIdx, setOpenIdxState] = useState<string | null>(null);
  const setOpenIdx = useCallback(
    (val) => {
      if (!isOpen) {
        onTempExpand();
        setOpenIdxState(val);
      } else {
        setOpenIdxState(openIdx !== val ? val : null);
      }
    },
    [setOpenIdxState, onTempExpand, openIdx, isOpen],
  );

  const theme = useTheme();
  const color = isOpen
    ? theme.palette.text.primary
    : theme.palette.primary.contrastText;
  const width = isOpen ? widths.full : variant === "mini" ? widths.mini : 0;
  const height = topBarHeight > 0 ? window.innerHeight - topBarHeight : "100vh";
  const bgColor = isOpen
    ? theme.palette.background.default
    : theme.palette.primary.dark;
  const styles = useSpring({
    color,
    width,
    backgroundColor: bgColor,
    outline: 0,
  });

  const drawer = (
    <Box
      component={animated.div}
      position="fixed"
      style={{ ...styles, height: "100vh" }}
      flexDirection="column"
      paddingLeft={1}
      paddingRight={1}
      display="flex"
      overflow="hidden"
    >
      <Box display="flex" alignItems="center" height={heights.toolbar}>
        <Tooltip title="Main Menu">
          <IconButton color="inherit" onClick={onToggle} aria-expanded={isOpen}>
            <MenuIcon />
          </IconButton>
        </Tooltip>{" "}
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
          overflowY: "auto",
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
              const handler = (linkProps as LinkConfig).onClick;
              if (handler !== undefined) {
                handler();
              }
              onClose();
            }}
          />
        ))}
      </Box>

      <HorizontalRule color={color} />

      <Footer
        accountId={accountId}
        isOpen={isOpen}
        toolbarItems={toolbarItems}
      />
    </Box>
  );

  if (variant === "mini" && expanded) {
    return (
      <React.Fragment>
        <Box width={widths.mini} flex="0 0 auto" position="relative" />
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
      <Box style={{ width }} position="relative" flex="0 0 auto" />
      {React.cloneElement(drawer, { style: { ...drawer.props.style, height } })}
    </React.Fragment>
  );
};

export default Drawer;
