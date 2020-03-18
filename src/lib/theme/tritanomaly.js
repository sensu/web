import createTheme from "/lib/theme/createTheme";
import colors from "/lib/colors";

const theme = (type = "light") =>
  createTheme({
    palette: {
      type,

      critical: {
        light: colors.pink[100],
        main: colors.pink[300],
        dark: colors.pink[500],
      },
      warning: {
        light: colors.pink[700],
        main: colors.pink[800],
        dark: colors.pink[900],
      },
      unknown: {
        light: colors.blue[50],
        main: colors.blue[300],
        dark: colors.blue[500],
      },
      success: {
        light: colors.grey[200],
        main: colors.grey[400],
        dark: colors.grey[600],
      },
      error: {
        light: colors.pink[50],
        main: colors.pink[300],
        dark: colors.pink[500],
      },

      primary: {
        light: colors.blue[400],
        main: colors.blue[700],
        dark: colors.blue[600],
        contrastText: "#F3F5F7",
      },
      secondary: {
        light: colors.pink[100],
        main: colors.pink[200],
        dark: colors.pink[300],
        contrastText: "#1D2237",
      },
    },
  });

export default theme;
