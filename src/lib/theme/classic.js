import createTheme from "/lib/theme/createTheme";
import colors from "/lib/colors";

const theme = (type = "light") =>
  createTheme({
    palette: {
      type,

      primary: {
        light: colors.appleGreen[300],
        main: colors.appleGreen[500],
        dark: colors.appleGreen[900],
      },
      secondary: {
        light: colors.pistachio[300],
        main: colors.pistachio[500],
        dark: colors.pistachio[700],
      },
      contrastThreshold: 2,
    },
  });

export default theme;
