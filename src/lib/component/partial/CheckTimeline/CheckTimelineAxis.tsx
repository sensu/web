import React from "/vendor/react";

import { AxisBottom } from "@vx/axis";
import { useTheme } from "/vendor/@material-ui/styles";
import { Theme, makeAxisLabelProps } from "./util";

interface AxisProps {
  x: number;
  y: number;
  scale(_: Date): number;
}

const Axis = React.memo(({ x, y, scale }: AxisProps) => {
  const theme: Theme = useTheme();
  const bandColour = "#D8D8D8";

  return (
    <AxisBottom
      top={y}
      left={x}
      scale={scale}
      tickStroke={bandColour}
      tickLabelProps={() => makeAxisLabelProps(theme)}
      stroke={bandColour}
      strokeWidth={0.5}
      numTicks={4}
    />
  );
});
Axis.displayName = "CheckTimeline.Axis";

export default Axis;
