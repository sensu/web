import colors from "/lib/colors";

// Overrides defaults provided by Material-UI (material-ui/src/styles)
const common = {
  direction: "ltr",
  palette: {
    success: {
      light: colors.green[300],
      main: colors.green[500],
      dark: colors.green[700],
      contrastText: "#F3F5F7",
    },
    warning: {
      light: colors.yellow[300],
      main: colors.yellow[500],
      dark: colors.yellow[700],
      contrastText: "#F3F5F7",
    },
    // NOTE: this theme and subsequent themes use error and critical
    // interchangably. Error colours are baked in, so we are defining
    // them here as the same thing - since errors and criticals sort of
    // relate to the same concept
    critical: {
      light: colors.red[300],
      main: colors.red[500],
      dark: colors.red[700],
      contrastText: "#F3F5F7",
    },
    error: {
      light: colors.red[300],
      main: colors.red[500],
      dark: colors.red[700],
      contrastText: "#F3F5F7",
    },
    unknown: {
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
  },
  typography: () => {
    // Prefer 'Display' for larger fonts
    // https://developer.apple.com/ios/human-interface-guidelines/visual-design/typography/
    const title = `"SF Pro Display", "Segoe UI Light", "Roboto", "Helvetica", "Arial", sans-serif`;
    const body = `"SF Pro Text", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif`;
    const mono = `"SFMono-Regular", Consolas, "Liberation Mono", Menlo,Courier, monospace`;

    return {
      fontFamily: title,
      h1: {
        fontFamily: title,
        fontWeight: 700,
      },
      overline: {
        fontFamily: title,
        letterSpacing: "1.115em",
      },
      body1: {
        fontFamily: body,
      },
      body2: {
        fontFamily: body,
      },
      button: {
        fontFamily: title,
        fontWeight: "bold",
      },
      monospace: {
        fontFamily: mono,
      },

      // https://material-ui.com/style/typography/#migration-to-typography-v2
      useNextVariants: true,
    };
  },
  overrides: {
    MuiDialog: {
      root: {
        backdropFilter: "blur(3px)",
        transition: "backdropFilter 300ms ease-in-out",
      },
    },
  },
};

const makeDefaults = type => {
  if (type === "light") {
    return {
      ...common,
      palette: {
        ...common.palette,
        text: {
          ...common.palette.text,
          // primary: "#2D3555",
        },
      },
    };
  }

  return {
    ...common,
    palette: {
      type,
      background: {
        // default: "#151928",
        // paper: "rgba(45, 53, 85, 0.5)",
      },
      text: {
        ...common.palette.text,
        // primary: "#D5D6DD",
      },
      ...common.palette,
    },
  };
};

export default makeDefaults;
