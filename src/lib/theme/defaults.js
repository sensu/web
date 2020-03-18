import colors from "/lib/colors";

// Overrides defaults provided by Material-UI (material-ui/src/styles)
const common = {
  direction: "ltr",
  palette: {
    success: {
      main: "rgb(141, 188, 105)",
      dark: "#789e5c",
    },
    warning: {
      main: "rgb(213, 171, 59)",
      dark: "#aa882f",
    },
    critical: {
      main: "rgb(204, 62, 100)",
      dark: "#a33150",
    },
    unknown: {
      main: "rgb(211, 97, 53)",
      dark: "#a84d2a",
    },
    info: {
      main: colors.paynesGrey[500],
      dark: colors.paynesGrey[700],
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
