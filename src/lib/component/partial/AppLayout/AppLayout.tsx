import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { useBreakpoint, useIdentity } from "/lib/component/util";
import { AppLayout as BaseAppLayout } from "/lib/component/base";
import Breadcrumbs from "/lib/component/partial/Breadcrumbs";
import AppBar from "/lib/component/partial/AppBar";
import Drawer from "./AppDrawer";

interface Props {
  // when true breadcrumbs are explicitly omitted from the view.
  disableBreadcrumbs?: boolean;

  // allows content to take full width of the container.
  fullWidth?: boolean;

  // enable if some required content is still loading; unused at the moment,
  // retained for compatibility.
  loading?: boolean;

  // content
  children: React.ReactElement;
}

const AppLayout = ({
  disableBreadcrumbs = false,
  fullWidth = false,
  children,
}: Props) => {
  const identity = useIdentity();

  const isSmViewport = useBreakpoint("xs", "lt");
  const isLgViewport = useBreakpoint("md", "gt");

  const [expanded, setExpanded] = React.useState(false);
  const openMenu = React.useCallback(() => setExpanded(true), [setExpanded]);

  return (
    <BaseAppLayout
      fullWidth={fullWidth}
      mobile={isSmViewport}
      topBar={
        isSmViewport && (
          <AppBar accountId={identity.sub} onRequestMenu={openMenu} />
        )
      }
      drawer={
        <Drawer
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
  );
};

AppLayout.fragments = {
  namespace: gql`
    fragment AppLayout_namespace on Namespace {
      id
    }
  `,
};

export default AppLayout;
