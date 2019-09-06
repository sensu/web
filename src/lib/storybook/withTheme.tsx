import React, { useEffect, useState } from "react";
import addons from "@storybook/addons";

import { ThemeProvider, ResetStyles, ThemeStyles } from "/lib/component/base";

interface Props {
  children: (t: any) => any;
}

const WithTheme = ({ children }: Props) => {
  const [theme, setTheme] = useState({});
  useEffect(() => {
    const id = "theme/CHANGE";
    const ch = addons.getChannel();

    ch.on(id, setTheme);
    return () => ch.removeListener(id, setTheme);
  }, [setTheme]);

  return children(theme);
};

const decorator = (fn: () => any) => {
  return (
    <WithTheme>
      {(theme) => (
        <ThemeProvider theme={theme.value} dark={theme.dark}>
          <ResetStyles />
          <ThemeStyles />
          {fn()}
        </ThemeProvider>
      )}
    </WithTheme>
  );
};

export default decorator;
