import createTheme from "/lib/theme/createTheme";
import colors from "/lib/colors";

const theme = (type = "light") =>
  createTheme({
    palette: {
      type,

      critical: {
        light: colors.lime[300],
        main: colors.lime[500],
        dark: colors.lime[700],
      },
      warning: {
        light: colors.lime[700],
        main: colors.lime[900],
        dark: colors.lime[900],
      },
      unknown: {
        light: colors.indigo[100],
        main: colors.indigo[300],
        dark: colors.indigo[500],
      },
      success: {
        light: colors.grey[200],
        main: colors.grey[400],
        dark: colors.grey[600],
      },
      error: {
        light: colors.lime[300],
        main: colors.lime[500],
        dark: colors.lime[700],
      },

      primary: {
        light: colors.indigo[400],
        main: colors.indigo[700],
        dark: colors.indigo[600],
        contrastText: "#F3F5F7",
      },
      secondary: {
        light: colors.blue[100],
        main: colors.blue[200],
        dark: colors.blue[300],
        contrastText: "#1D2237",
      },
    },
  });

export default theme;
