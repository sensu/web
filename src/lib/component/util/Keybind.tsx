import React, { useContext, useEffect } from "/vendor/react";
import mousetrap from "mousetrap";

interface Binding {
  id: string;
  keys: string;
  callback: () => void;
}

interface Manager {
  trap: MousetrapInstance;
  bindings: Binding[];
}

interface ProviderProps {
  target?: Element;
  children: React.ReactNode;
}

const createManager = (target?: Element) => {
  return {
    trap: new mousetrap(target),
    bindings: [],
  };
};

const addBinding = (manager: Manager, binding: Binding) => {
  manager.bindings.push(binding);
  manager.trap.bind(binding.keys, () => {
    const firstBinding = manager.bindings
      .reverse()
      .find((el) => el.keys === binding.keys);
    if (firstBinding) {
      firstBinding.callback();
    }
  });
};

const removeBinding = (manager: Manager, binding: Binding) => {
  manager.bindings = manager.bindings.reduce(
    (acc, el) => {
      if (el.id === binding.id) {
        return acc;
      }
      return [...acc, el];
    },
    [] as Binding[],
  );
};

const Context = React.createContext<Manager>(createManager());

const Provider = ({ target, children }: ProviderProps) => {
  const manager = createManager(target);
  return <Context.Provider value={manager}>{children}</Context.Provider>;
};

const useKeybind = (binding: Binding) => {
  const manager = useContext(Context);

  useEffect(() => {
    addBinding(manager, binding);
    return () => removeBinding(manager, binding);
  });
};

export default useKeybind;
export { Provider };
