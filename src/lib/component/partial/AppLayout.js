import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  useBreakpoint,
  NavigationContext,
  useDrawerPreference,
  useIdentity,
} from "/lib/component/util";
import { AppLayout as BaseAppLayout, Loader } from "/lib/component/base";

import Breadcrumbs from "/lib/component/partial/Breadcrumbs";
import Drawer from "/lib/component/base/Drawer";
import AppBar from "/lib/component/partial/AppBar";

const DrawerContainer = React.memo(
  ({ isLgViewport, isSmViewport, accountId, expanded, onExpand }) => {
    const { links, toolbarItems } = React.useContext(NavigationContext);

    const [minified, setMinified] = useDrawerPreference();

    let variant = "mini";
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

    const handleClose = React.useCallback(() => onExpand(false), [
      onExpand,
    ]);

    return (
      <Drawer
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
  },
);

DrawerContainer.displayName = "DrawerContainer";

const AppLayout = ({ disableBreadcrumbs, loading, fullWidth, children }) => {
  const identity = useIdentity();

  const isSmViewport = useBreakpoint("xs", "lt");
  const isLgViewport = useBreakpoint("md", "gt");

  const [expanded, setExpanded] = React.useState(false);
  const openMenu = React.useCallback(() => setExpanded(true), [setExpanded]);

  return (
    <Loader loading={loading}>
      <BaseAppLayout
        fullWidth={fullWidth}
        mobile={isSmViewport}
        topBar={
          isSmViewport && (
            <AppBar accountId={identity.sub} onRequestMenu={openMenu} />
          )
        }
        drawer={
          <DrawerContainer
            accountId={identity.sub}
            isLgViewport={isLgViewport}
            isSmViewport={isSmViewport}
            expanded={expanded}
            onExpand={setExpanded}
          />
        }
        content={
          <React.Fragment>
            {!disableBreadcrumbs && !isSmViewport && <Breadcrumbs />}
            {children}
          </React.Fragment>
        }
      />
    </Loader>
  );
};

AppLayout.fragments = {
  namespace: gql`
    fragment AppLayout_namespace on Namespace {
      # TODO
      id
    }
  `,
};

AppLayout.propTypes = {
  children: PropTypes.node,
  disableBreadcrumbs: PropTypes.bool,
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  namespace: PropTypes.string,
};

AppLayout.defaultProps = {
  disableBreadcrumbs: false,
  children: undefined,
  fullWidth: false,
  loading: false,
  namespace: null,
};

export default AppLayout;
