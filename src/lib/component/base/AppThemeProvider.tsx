import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { useSystemColorSchemePreference, useQuery } from "/lib/component/util";
import ThemeProvider from "/lib/component/base/ThemeProvider";

const query = gql`
  query ThemeProviderQuery {
    theme @client {
      value
      dark
    }
  }
`;

interface QueryResult {
  theme: {
    value: string;
    dark: "DARK" | "LIGHT" | "UNSET";
  };
}

interface Props {
  children: React.ReactElement;
}

const AppThemeProvider = ({ children }: Props) => {
  const queryResult = useQuery<QueryResult>({ query });
  const sysPref = useSystemColorSchemePreference();

  const storedPref = queryResult.data as QueryResult;
  if (!storedPref.theme) {
    throw new Error(
      "Unable to get stored theme preferences from the store. May indicate that the store is not availabe in the current context.",
    );
  }

  const theme = storedPref.theme.value;
  const dark =
    storedPref.theme.dark !== "UNSET"
      ? storedPref.theme.dark === "DARK"
      : sysPref;

  return (
    <ThemeProvider theme={theme} dark={dark}>
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
