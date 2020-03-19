import createTheme from "/lib/theme/createTheme";
import colors from "/lib/colors";

const theme = (type = "light") =>
  createTheme({
    palette: {
      type,

      critical: {
        light: colors.teal[200],
        main: colors.red[500],
        dark: colors.red[700],
        contrastText: "#F3F5F7",
      },
      error: {
        light: colors.teal[200],
        main: colors.pink[400],
        dark: colors.pink[700],
        contrastText: "#F3F5F7",
      },
      warning: {
        light: colors.teal[200],
        main: colors.teal[500],
        dark: colors.teal[700],
        contrastText: "#F3F5F7",
      },
      unknown: {
        light: colors.blue[50],
        main: colors.blue[300],
        dark: colors.blue[500],
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
        light: colors.pink[200],
        main: colors.pink[300],
        dark: colors.pink[400],
        contrastText: "#F3F5F7",
      },
      secondary: {
        light: colors.blue[50],
        main: colors.blue[300],
        dark: colors.blue[500],
        contrastText: "#1D2237",
      },
    },
  });

export default theme;
