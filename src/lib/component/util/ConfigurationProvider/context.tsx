import React from "/vendor/react";

// LinkPolicy describes valid URLs that the web application may expand into
// image tags and links.
export interface LinkPolicy {
  allowList: boolean;
  URLs: string[];
}

// UserPreferences describes user preferences.
export interface UserPreferences {
  pageSize: number;
  theme: string;
}

export interface State {
  linkPolicy: LinkPolicy;
  preferences: UserPreferences;
}

export default React.createContext<State>({
  linkPolicy: {
    allowList: false,
    URLs: [],
  },
  preferences: {
    pageSize: 20,
    theme: "default",
  },
});
