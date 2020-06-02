import createTheme from "/lib/theme/createTheme";

const theme = (type = "dark") =>
  createTheme({
    palette: {
      type,

      critical: {
        light: "#FF0000",
        main: "#FF0000",
        dark: "#FF0000",
        contrastText: "#000000",
      },
      error: {
        light: "#FF0000",
        main: "#FF0000",
        dark: "#FF0000",
        contrastText: "#000000",
      },
      warning: {
        light: "#FFFF00",
        main: "#FFFF00",
        dark: "#FFFF00",
        contrastText: "#000000",
      },
      unknown: {
        light: "#ffa500",
        main: "#ffa500",
        dark: "#ffa500",
        contrastText: "#000000",
      },
      success: {
        light: "#00FF00",
        main: "#00FF00",
        dark: "#00FF00",
        contrastText: "#000000",
      },
      info: {
        light: "#FF00FF",
        main: "#FF00FF",
        dark: "#FF00FF",
        contrastText: "#000000",
      },

      primary: {
        light: "#00FFFF",
        main: "#00FFFF",
        dark: "#00FFFF",
        contrastText: "#000000",
      },
      secondary: {
        light: "#FFFFFF",
        main: "#FFFFFF",
        dark: "#FFFFFF",
        contrastText: "#000000",
      },

      background: {
        default: "#000000",
        paper: "#000000",
      },

      divider: "#FFFFFF",
      text: { primary: "#FFFFFF", secondary: "#FF00FF" },
      action: { disabled: "#535353", hover: "#202020", active: "#FFFFFF" },
    },
  });

export default theme;
