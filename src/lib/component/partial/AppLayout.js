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

const DrawerContainer = React.memo(({ isLgViewport, isSmViewport, accountId }) => {
  const { links } = React.useContext(NavigationContext);

  const [minified, setMinified] = useDrawerPreference();
  const [expanded, setExpanded] = React.useState(false);

  let variant = "mini";
  if (isLgViewport && (!minified || expanded)) {
    variant = "full";
  } else if (isSmViewport) {
    variant = "hidden";
  }

  const handleToggle = React.useCallback(
    () => {
      if ((minified && expanded) || !isLgViewport) {
        setExpanded(!expanded);
      } else {
        setMinified(!minified);
      }
    },
    [isLgViewport, minified, expanded, setMinified, setExpanded],
  );

  const handleTempExpand = React.useCallback(
    () => variant !== "full" && setExpanded(true),
    [variant, setExpanded],
  );

  const handleClose = React.useCallback(
    () => setExpanded(false),
    [setExpanded],
  );

  return (
    <Drawer
      accountId={accountId}
      variant={variant}
      expanded={expanded}
      onToggle={handleToggle}
      onClose={handleClose}
      onTempExpand={handleTempExpand}
      links={links}
    />
  );
});

DrawerContainer.displayName = "DrawerContainer";

const AppLayout = ({
  disableBreadcrumbs,
  loading,
  fullWidth,
  children,
}) => {
  const isSmViewport = useBreakpoint("xs", "lt");
  const isLgViewport = useBreakpoint("md", "gt");

  const identity = useIdentity();

  return (
    <Loader loading={loading}>
      <BaseAppLayout
        fullWidth={fullWidth}
        mobile={isSmViewport}
        topBar={
          isSmViewport && <AppBar loading={loading} />
        }
        drawer={
          <DrawerContainer
            accountId={identity.sub}
            isLgViewport={isLgViewport}
            isSmViewport={isSmViewport}
          />
        }
        content={
          <React.Fragment>
            {!disableBreadcrumbs && <Breadcrumbs />}
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
      id
      ...AppBar_namespace
    }

    ${AppBar.fragments.namespace}
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
