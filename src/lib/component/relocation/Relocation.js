/* eslint-disable react/prop-types */
/* eslint-disable react/no-multi-comp */

import React from "/vendor/react";

import uniqueId from "/lib/util/uniqueId";
import { mergeAtIndex, removeAtIndex } from "/lib/util/array";

import useUniqiueId from "/lib/component/util/useUniqueId";

const StateContext = React.createContext([]);

const ActionContext = React.createContext({
  setChild: () => {},
  removeChild: () => {},
});

export const Provider = ({ children }) => {
  const [elements, setElements] = React.useState([]);

  const actions = React.useMemo(
    () => ({
      removeChild: id => {
        setElements(previousElements => {
          const index = previousElements.findIndex(
            element => element.id === id,
          );

          if (index === -1) {
            return null;
          }

          return removeAtIndex(previousElements, index);
        });
      },

      setChild: (id = uniqueId(), props) => {
        setElements(previousElements => {
          const index = previousElements.findIndex(
            element => element.id === id,
          );

          if (index === -1) {
            const element = {
              id,
              props,
              update: nextProps => actions.setChild(id, nextProps),
              remove: () => actions.removeChild(id),
            };
            return previousElements.concat([element]);
          }

          return mergeAtIndex(previousElements, index, { props });
        });

        return id;
      },
    }),
    [],
  );

  return (
    <ActionContext.Provider value={actions}>
      <StateContext.Provider value={elements}>{children}</StateContext.Provider>
    </ActionContext.Provider>
  );
};

export const useSink = element => {
  const id = useUniqiueId();

  const { setChild, removeChild } = React.useContext(ActionContext);

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
  return React.useContext(StateContext);
};

export const useRelocation = () => {
  return React.useContext(ActionContext);
};

export const Well = ({ children }) => {
  const elements = useWell();
  return children({ elements });
};

export const Consumer = ({ children }) => {
  const { setChild, removeChild } = useRelocation();
  return children({ setChild, removeChild });
};
