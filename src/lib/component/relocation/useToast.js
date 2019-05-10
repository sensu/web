import React from "/vendor/react";

import { useRelocation } from "/lib/component/relocation/Relocation";
import { TOAST } from "/lib/component/relocation/types";

const useToast = () => {
  const { setChild } = useRelocation();
  return React.useCallback(
    (id, render) => setChild(id, { render, type: TOAST }),
    [setChild],
  );
};

export const ToastConnector = ({ children }) => {
  const setToast = useToast();
  return children({ setToast });
};

export default useToast;
