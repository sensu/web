import React, { useRef, useEffect } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "/vendor/@material-ui/core";
import { ChevronIcon } from "/lib/component/icon";

interface Props {
  icon: React.ReactElement;
  primary: React.ReactElement | string;
  secondary?: React.ReactElement | string | null;
  decoration?: React.ReactElement;
  dense?: boolean;
  selected?: boolean;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClick?: () => void;
}

const ContextSwitcherListItem = ({
  icon,
  primary,
  secondary = null,
  decoration = <ChevronIcon direction="right" />,
  dense = false,
  selected = false,
  ...props
}: Props) => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    const el = ref.current;
    if (el && selected) {
      el.scrollIntoView({
        // behavior: "smooth",
        block: "nearest",
      });
    }
  }, [ref, selected]);

  return (
    <ListItem
      {...props}
      button
      buttonRef={ref}
      selected={selected}
      dense={dense}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={primary} secondary={secondary} />
      <ListItemSecondaryAction>{decoration}</ListItemSecondaryAction>
    </ListItem>
  );
};

export default ContextSwitcherListItem;
