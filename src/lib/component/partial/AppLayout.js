import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  useBreakpoint,
  NavigationContext,
  useDrawerPreference,
} from "/lib/component/util";
import { AppLayout as BaseAppLayout, Loader } from "/lib/component/base";

import Breadcrumbs from "/lib/component/partial/Breadcrumbs";
import Drawer from "/lib/component/base/Drawer";
import AppBar from "/lib/component/partial/AppBar";

const AppLayout = ({
  disableBreadcrumbs,
  namespace: namespaceProp,
  loading,
  fullWidth,
  children,
}) => {
  const isSmViewport = useBreakpoint("xs", "lt");
  const isLgViewport = useBreakpoint("md", "gt");

  // TODO: Query data from cache
  const namespace = namespaceProp ? { name: namespaceProp } : null;
  const { links } = React.useContext(NavigationContext);

  const [minified, setMinified] = useDrawerPreference();
  const [drawerExpanded, setDrawerExpanded] = React.useState(false);
  const toggleDrawerState = React.useCallback(() => {
    console.debug({ isLgViewport, minified })
    if (isLgViewport) {
      setMinified(!minified);
    } else {
      setDrawerExpanded(!drawerExpanded);
    }
  }, [isLgViewport, minified, drawerExpanded, setMinified, setDrawerExpanded]);

  let drawerVariant = "mini";
  if (isLgViewport && !minified) {
    drawerVariant = "full";
  } else if (isSmViewport) {
    drawerVariant = "hidden";
  }

  return (
    <Loader loading={loading}>
      <BaseAppLayout
        fullWidth={fullWidth}
        mobile={isSmViewport}
        topBar={
          isSmViewport && <AppBar loading={loading} namespace={namespace} />
        }
        drawer={
          <Drawer
            accountId="jamesdphillips"
            variant={drawerVariant}
            expanded={drawerExpanded}
            onToggle={toggleDrawerState}
            onClose={() => setDrawerExpanded(false)}
            links={links}
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
