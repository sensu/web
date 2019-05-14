import React from "/vendor/react";

import { useRelocation } from "/lib/component/relocation/Relocation";
import { BANNER } from "/lib/component/relocation/types";
import usePromiseBoundComponent from "/lib/component/relocation/usePromiseBoundComponent";

const useBanner = () => {
  const { setChild } = useRelocation();
  return React.useCallback(
    render => setChild(undefined, { render, type: BANNER }),
    [setChild],
  );
};

export const usePromiseBoundBanner = () => {
  const update = usePromiseBoundComponent();

  return (promise, render, handleError) => {
    update(
      promise,
      ({ resolved, rejected, result, error }) => ({
        type: BANNER,
        render: ({ remove }) =>
          render({ remove, resolved, rejected, result, error }),
      }),
      handleError,
    );
  };
};

export const BannerConnector = ({ children }) => {
  const setBanner = useBanner();
  return children({ setBanner });
};

export default useBanner;
