import React from "/vendor/react";

import usePreferredTheme from "/lib/component/util/usePreferredTheme";
import ThemeProvider from "/lib/component/base/ThemeProvider";

interface Props {
  children: React.ReactElement;
}

const AppThemeProvider = ({ children }: Props) => {
  const theme = usePreferredTheme();

  return (
    <ThemeProvider theme={theme.value} dark={theme.dark}>
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
