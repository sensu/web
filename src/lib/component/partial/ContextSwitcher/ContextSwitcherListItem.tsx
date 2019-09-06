import React, { useRef, useEffect } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "/vendor/@material-ui/core";
import { ChevronIcon } from "/lib/component/icon";

interface Props extends React.HTMLProps<HTMLButtonElement> {
  icon: React.ReactElement;
  name: React.ReactElement | string;
  decoration?: React.ReactElement;
  dense?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

const ContextSwitcherListItem = ({
  icon,
  name,
  decoration = <ChevronIcon direction="right" />,
  dense = false,
  selected = false,
  ...props
}: Props) => {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    const el = ref.current;
    if (el && selected) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [ref, selected]);

  return (
    <ListItem {...props} ref={ref} button selected={selected} dense={dense}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={name} />
      <ListItemSecondaryAction>{decoration}</ListItemSecondaryAction>
    </ListItem>
  );
};

export default ContextSwitcherListItem;
