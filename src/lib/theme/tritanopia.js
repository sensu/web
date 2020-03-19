import createTheme from "/lib/theme/createTheme";
import colors from "/lib/colors";

const theme = (type = "light") =>
  createTheme({
    palette: {
      type,

      critical: {
        light: colors.redderRed[300],
        main: colors.redderRed[500],
        dark: colors.redderRed[700],
        contrastText: "#F3F5F7",
      },
      error: {
        light: colors.redderRed[300],
        main: colors.redderRed[500],
        dark: colors.redderRed[700],
        contrastText: "#F3F5F7",
      },
      warning: {
        light: colors.teal[200],
        main: colors.teal[500],
        dark: colors.teal[700],
        contrastText: "#F3F5F7",
      },
      unknown: {
        light: colors.blue[300],
        main: colors.blue[500],
        dark: colors.blue[700],
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
        light: colors.blue[600],
        main: colors.blue[700],
        dark: colors.blue[800],
        contrastText: "#1D2237",
      },
    },
  });

export default theme;
