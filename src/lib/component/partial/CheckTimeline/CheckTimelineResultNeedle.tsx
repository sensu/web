import React from "/vendor/react";

import { useTheme } from "/vendor/@material-ui/styles";
import * as m from "/vendor/@material-ui/core/styles/colorManipulator";

import { Theme, getColor } from "./util";

/*
 * Constant
 */

const lineWidth = 1.41;
const lineOpacityMx = 8;

const knobSize = 9;
const knobSizeMx = 16;

/*
 * Type Def
 */

export interface ResultNeedleProps {
  x: number;
  y: number;

  status: number; // TODO: change to colour
  height: number;

  // distance from user's cursor; represented as a fraction of total width
  dst: number;

  // if this needle is closest to the user's cursor
  closest: boolean;
}

/*
 * Component
 */

const ResultNeedle = React.forwardRef(
  ({ x, y, closest, dst, status, height }: ResultNeedleProps, ref: any) => {
    if (dst < 1 / 8) {
      return null;
    }

    const theme = useTheme() as Theme;
    const statusColour = getColor(theme.palette, status);

    const t = dst ** knobSizeMx * knobSize;

    const colour = m.fade(m.darken(statusColour, 0.41), dst ** lineOpacityMx);
    const strokeWidth = Math.max(dst ** 2 * lineWidth, lineWidth / 2);

    return (
      <g stroke={colour} fill={colour}>
        {closest && (
          <polygon
            points={`${x - t / 2}, 0 ${x + t / 2}, 0 ${x}, ${t}`}
            strokeWidth={0}
          />
        )}
        <line
          ref={ref}
          x1={x}
          x2={x}
          y1={y}
          y2={height}
          strokeWidth={strokeWidth}
        />
      </g>
    );
  },
);
ResultNeedle.displayName = "CheckTimeline.ResultNeedle";

export default ResultNeedle;
