import React from "/vendor/react";

import { useRelocation } from "/lib/component/relocation/Relocation";
import { BANNER } from "/lib/component/relocation/types";

const useBanner = () => {
  const { setChild } = useRelocation();
  return React.useCallback(
    render => setChild(undefined, { render, type: BANNER }),
    [setChild],
  );
};

export const BannerConnector = ({ children }) => {
  const setBanner = useBanner();
  return children({ setBanner });
};

export default useBanner;
