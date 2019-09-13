import { useState, useEffect } from "/vendor/react";

const useSystemColorSchemePreference = () => {
  const queryList = window.matchMedia("(prefers-color-scheme: dark)");
  const [pref, setPref] = useState(queryList.matches);
  const toggle = (ev: MediaQueryListEvent) => setPref(ev.matches);

  useEffect(() => {
    queryList.addListener(toggle);
    return () => queryList.removeListener(toggle);
  });

  return pref;
};

export default useSystemColorSchemePreference;
