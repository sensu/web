import { emphasize } from "/vendor/@material-ui/core/styles/colorManipulator";

interface Swatch {
  light: string;
  main: string;
  dark: string;
}

interface Palette {
  text: {
    primary: string;
  };
  background: {
    paper: string;
  };
  warning: Swatch;
  critical: Swatch;
}

export interface Theme {
  palette: Palette;
  typography: {
    fontFamily: string;
  };
}

export const makeAxisLabelProps = (theme: Theme) => ({
  textAnchor: "middle",
  fontFamily: theme.typography.fontFamily,
  fontSize: 10,
  fill: theme.palette.text.primary,
});

export const getGrey = (palette: Palette) => emphasize(palette.background.paper, 0.083);

export const getFontOpacity = (palette: Palette, status: number) => {
  if (status === 0) {
    return 0.71;
  }
  return 0.178;
};

export const getColor = (palette: Palette, status: number): string => {
  switch (status) {
    case 0:
      return getGrey(palette);
    case 1:
      return palette.warning.main;
    default:
  }
  return palette.critical.main;
};
