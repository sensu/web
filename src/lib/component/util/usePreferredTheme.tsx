import gql from "/vendor/graphql-tag";

import useQuery from "./useQuery";
import useConfigurationProvider from "./ConfigurationProvider/useConfigurationProvider";
import useSystemColorSchemePreference from "./useSystemColorSchemePreference";

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

const usePreferredTheme = () => {
  const queryResult = useQuery<QueryResult>({ query });
  const sysPref = useSystemColorSchemePreference();
  const config = useConfigurationProvider();

  const storedPref = queryResult.data as QueryResult;
  if (!storedPref.theme) {
    throw new Error(
      "Unable to get stored theme preferences from the store. May indicate that the store is not availabe in the current context.",
    );
  }

  const value = storedPref.theme.value || config.preferences.theme;
  const dark =
    storedPref.theme.dark !== "UNSET"
      ? storedPref.theme.dark === "DARK"
      : sysPref;

  return {
    value,
    dark,
    usingSystemColourScheme: storedPref.theme.dark === "UNSET",
  };
};

export default usePreferredTheme;
