/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */

import React from "/vendor/react";

import uniqueId from "/lib/util/uniqueId";
import { mergeAtIndex, removeAtIndex } from "/lib/util/array";

import useUniqiueId from "/lib/component/util/useUniqueId";

const Context = React.createContext({
  setChild: () => {},
  removeChild: () => {},
  elements: [],
});

export const Provider = ({ children }) => {
  const [elements, setElements] = React.useState([]);

  const createChild = React.useCallback(props => {
    setElements(previousElements => {
      const id = uniqueId();

      const element = {
        update: nextProps => this.updateChild(id, nextProps),
        remove: () => this.removeChild(id),
        id,
        props,
      };

      return previousElements.concat([element]);
    });
  }, []);

  const setChild = React.useCallback((id, props) => {
    setElements(previousElements => {
      const index = previousElements.findIndex(element => element.id === id);

      if (index === -1) {
        const element = { id, props };
        return previousElements.concat([element]);
      }

      return mergeAtIndex(previousElements, index, { props });
    });
  }, []);

  const removeChild = React.useCallback(id => {
    setElements(previousElements => {
      const index = previousElements.findIndex(element => element.id === id);

      if (index === -1) {
        return null;
      }

      return removeAtIndex(previousElements, index);
    });
  }, []);

  const context = React.useMemo(
    () => ({ elements, createChild, setChild, removeChild }),
    [elements],
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useSink = element => {
  const id = useUniqiueId();

  const { setChild, removeChild } = React.useContext(Context);

  React.useEffect(() => {
    setChild(id, element);
  }, [element]);

  React.useEffect(() => {
    return () => removeChild(id);
  }, []);
};

export const Sink = ({ children }) => {
  useSink(children);
  return null;
};

export const useWell = () => {
  const { elements } = React.useContext(Context);
  return elements;
};

export const Well = ({ children }) => {
  const elements = useWell();
  return children({ elements });
};

export const useRelocation = () => {
  const { setChild, removeChild } = React.useContext(Context);

  return [setChild, removeChild];
};

export const Consumer = ({ children }) => {
  const [setChild, removeChild] = useRelocation();
  return children({ setChild, removeChild });
};
