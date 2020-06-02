import { styled } from "/vendor/@material-ui/core";
import { emphasize } from "/vendor/@material-ui/core/styles/colorManipulator";

const KeyboardInput = styled("kbd")(
  ({ theme }) => {
    const bgColor = theme.palette.primary.main;

    return {
      display: "inline-block",
      color: theme.palette.primary.contrastText,
      padding: `${theme.spacing(1 / 4)}px ${theme.spacing(1 / 2)}px`,
      backgroundColor: bgColor,
      borderRadius: theme.spacing(1 / 2),
      border: `1px solid ${emphasize(bgColor, 0.2)}`,
      boxShadow:
        "0 1px 1px rgba(0, 0, 0, .2), 0 1px 0 0 rgba(255, 255, 255, .7) inset",
      // @ts-ignore: we do not current have a type for additional properties our theme adds.
      fontFamily: theme.typography.monospace.fontFamily,
      fontWeight: 600,
      fontSize: "0.825em",
      lineHeight: 1,
      whiteSpace: "nowrap",
    };
  },
  { name: "KeyboardInput" },
);

export default KeyboardInput;
