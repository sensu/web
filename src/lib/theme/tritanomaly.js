import createTheme from "/lib/theme/createTheme";
import colors from "/lib/colors";

const theme = (type = "light") =>
  createTheme({
    palette: {
      type,

      critical: { main: colors.pink[300] },
      warning: { main: colors.pink[800], secondary: colors.pink[800] },
      unknown: { main: colors.blue[300] },
      success: { main: colors.grey[300], secondary: colors.grey[400] },

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
