import createTheme from "/lib/theme/createTheme";
import colors from "/lib/colors";

const theme = (type = "light") =>
  createTheme({
    palette: {
      type,

      critical: { main: colors.lime[500] },
      warning: { main: colors.lime[900], secondary: colors.lime[900] },
      unknown: { main: colors.indigo[300] },
      success: { main: colors.grey[400], secondary: colors.grey[400] },

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
