import { useContext } from "/vendor/react";
import Context, { State } from "./context";

function useConfigurationProvider() {
  return useContext<State>(Context);
}

export default useConfigurationProvider;
