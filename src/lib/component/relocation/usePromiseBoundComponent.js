import React from "react";

import { useRelocation } from "./Relocation";

const usePromiseBoundComponent = () => {
  const { setChild } = useRelocation();

  const idMap = React.useState(() => new WeakMap())[0];

  return (promise, update, handleError = error => Promise.reject(error)) => {
    promise.then(
      result => {
        setChild(
          idMap.get(promise),
          update({
            resolved: true,
            rejected: false,
            result,
            error: undefined,
          }),
        );
      },
      rawError => {
        const error = handleError(rawError);
        setChild(
          idMap.get(promise),
          update({
            resolved: false,
            rejected: true,
            result: undefined,
            error,
          }),
        );
      },
    );

    const id = setChild(
      idMap.get(promise),
      update({
        resolved: false,
        rejected: false,
        result: undefined,
        error: undefined,
      }),
    );

    idMap.set(promise, id);
  };
};

export default usePromiseBoundComponent;
