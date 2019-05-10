import React from "/vendor/react";

import { useRelocation } from "/lib/component/relocation/Relocation";
import { TOAST } from "/lib/component/relocation/types";
import usePromiseBoundComponent from "/lib/component/relocation/usePromiseBoundComponent";

const useToast = () => {
  const { setChild } = useRelocation();
  return React.useCallback(
    (id, render) => setChild(id, { render, type: TOAST }),
    [setChild],
  );
};

export const usePromiseBoundToast = () => {
  const update = usePromiseBoundComponent();

  return (promise, render, handleError) => {
    update(
      promise,
      ({ resolved, rejected, result, error }) => ({
        type: TOAST,
        render: ({ remove }) =>
          render({ remove, resolved, rejected, result, error }),
      }),
      handleError,
    );
  };
};

export const ToastConnector = ({ children }) => {
  const setToast = useToast();
  return children({ setToast });
};

export default useToast;
