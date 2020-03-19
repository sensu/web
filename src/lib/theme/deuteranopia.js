import createTheme from "/lib/theme/createTheme";
import colors from "/lib/colors";

const theme = (type = "light") =>
  createTheme({
    palette: {
      type,

      critical: {
        light: colors.lime[500],
        main: colors.lime[700],
        dark: colors.lime[700],
        contrastText: "#F3F5F7",
      },
      error: {
        light: colors.lime[500],
        main: colors.lime[700],
        dark: colors.lime[700],
        contrastText: "#F3F5F7",
      },
      warning: {
        light: colors.indigo[300],
        main: colors.indigo[500],
        dark: colors.indigo[700],
        contrastText: "#F3F5F7",
      },
      unknown: {
        light: colors.lime[800],
        main: colors.lime[900],
        dark: colors.lime[900],
        contrastText: "#F3F5F7",
      },
      success: {
        light: colors.grey[200],
        main: colors.grey[600],
        dark: colors.grey[800],
        contrastText: "#F3F5F7",
      },
      info: {
        light: colors.paynesGrey[300],
        main: colors.paynesGrey[500],
        dark: colors.paynesGrey[700],
        contrastText: "#F3F5F7",
      },

      primary: {
        light: colors.paynesGrey[300],
        main: colors.paynesGrey[500],
        dark: colors.paynesGrey[600],
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
