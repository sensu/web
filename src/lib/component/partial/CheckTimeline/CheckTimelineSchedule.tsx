import React from "/vendor/react";

import { useTheme } from "/vendor/@material-ui/styles";
import { Tooltip } from "/vendor/@material-ui/core";

import { ScheduleIcon } from "/lib/component/icon";
import { RelativeDate } from "/lib/component/base";

import { axisPadding } from "./constants";
import { Theme, getGrey, getFontOpacity, makeAxisLabelProps } from "./util";

export interface ScheduleProps {
  date: Date;
  nextDate?: Date;

  x: number;
  y: number;

  width: number;
  height: number;
}

const Schedule = React.memo(
  ({ date, nextDate, x, y, width, height }: ScheduleProps) => {
    const theme: Theme = useTheme();
    const bgColor = getGrey(theme.palette);
    const label = makeAxisLabelProps(theme);

    const iconSize = 24;
    const iconOpacity = getFontOpacity(theme.palette, 0);

    let scheduleLabel = (<React.Fragment>Not scheduled</React.Fragment>);
    if (nextDate) {
      scheduleLabel = <RelativeDate dateTime={nextDate} precision="seconds" to={date} />;
    }

    return (
      <React.Fragment>
        <Tooltip
          title={scheduleLabel}
          aria-label="next occurrence"
        >
          <svg x={x} y={y}>
            <rect x={0} y={0} width={width} height={height} fill={bgColor} />
            <ScheduleIcon
              x={(width - iconSize) / 2}
              y={(height - iconSize) / 2}
              width={iconSize}
              height={iconSize}
              style={{ color: `rgba(255,255,255,${iconOpacity})` }}
            />
          </svg>
        </Tooltip>
        <text
          x={x + width / 2}
          y={y + height + axisPadding + label.fontSize}
          dominantBaseline="hanging"
          {...label}
        >
          <tspan>Now</tspan>
        </text>
      </React.Fragment>
    );
  },
);
Schedule.displayName = "CheckTimeline.Schedule";

export default Schedule;
