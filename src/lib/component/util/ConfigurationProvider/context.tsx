import React from "/vendor/react";
import { configuration } from "/lib/constant";

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

export default React.createContext<State>(configuration);
