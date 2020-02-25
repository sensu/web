import React from "/vendor/react";

import { NavigationContext, useDrawerPreference } from "/lib/component/util";
import { Drawer as BaseDrawer } from "/lib/component/base";

type DrawerVariants = "full" | "mini" | "hidden";

interface Props {
  isLgViewport: boolean;
  isSmViewport: boolean;
  accountId?: string;
  expanded: boolean;
  onExpand: (_: boolean) => void;
}

const Drawer = ({
  isLgViewport,
  isSmViewport,
  accountId = "",
  expanded,
  onExpand,
}: Props) => {
  const { links, toolbarItems } = React.useContext(NavigationContext);

  const [minified, setMinified] = useDrawerPreference();

  let variant: DrawerVariants = "mini";
  if (isLgViewport && (!minified || expanded)) {
    variant = "full";
  } else if (isSmViewport) {
    variant = "hidden";
  }

  const handleToggle = React.useCallback(() => {
    if ((minified && expanded) || !isLgViewport) {
      onExpand(!expanded);
    } else {
      setMinified(!minified);
    }
  }, [isLgViewport, minified, expanded, setMinified, onExpand]);

  const handleTempExpand = React.useCallback(
    () => variant !== "full" && onExpand(true),
    [variant, onExpand],
  );

  const handleClose = React.useCallback(() => onExpand(false), [onExpand]);

  return (
    <BaseDrawer
      accountId={accountId}
      variant={variant}
      expanded={expanded}
      onToggle={handleToggle}
      onClose={handleClose}
      onTempExpand={handleTempExpand}
      links={links}
      toolbarItems={toolbarItems}
    />
  );
};

Drawer.displayName = "AppLayout.Drawer";

export default React.memo(Drawer);
