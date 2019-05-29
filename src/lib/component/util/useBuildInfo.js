import React from "/vendor/react";

import { getWebRevision, getSensuVersion } from "/lib/buildInfo";

const useBuildInfo = () =>
  React.useMemo(
    () => ({
      webRevision: getWebRevision(),
      sensuVersion: getSensuVersion(),
    }),
    [],
  );

export default useBuildInfo;
