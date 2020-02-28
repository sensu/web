import React, { memo } from "/vendor/react";
import { useTheme, Box } from "/vendor/@material-ui/core";
import { fade } from "/vendor/@material-ui/core/styles/colorManipulator";

interface Props {
  color?: string;
}

const HorizontalRule = memo(({ color: colorProp }: Props) => {
  const theme = useTheme();
  const color = colorProp || theme.palette.text.primary;
  const edgeColor = fade(color, 0.125);

  return (
    <Box
      component="hr"
      border="0"
      margin="0"
      marginTop="-1px"
      height="1px"
      style={{
        background: `linear-gradient(
          to right,
          rgba(0, 0, 0, 0),
          ${edgeColor} 10%,
          ${fade(color, 0.5)},
          ${edgeColor} 90%,
          rgba(0, 0, 0, 0)
        )`,
      }}
    />
  );
});
HorizontalRule.displayName = "HorizontalRule";

export default HorizontalRule;
