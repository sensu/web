import React, { useMemo } from "/vendor/react";
import { scaleTime } from "d3-scale";

import Axis from "./CheckTimelineAxis";
import Bar from "./CheckTimelineBar";
import StatusIcon from "./CheckTimelineStatusIcon";
import Schedule from "./CheckTimelineSchedule";
import ResultIndicatorLayer from "./CheckTimelineResultIndicatorLayer";

import {
  minAxisHeight,
  minScheduleWidth,
  schedulePadding,
  scheduleWidth,
  axisHeight,
  axisPadding,
} from "./constants";

interface Segment {
  begin: Date;
  end?: Date;
  status: number;
}

interface Entry {
  ts: Date;
  status: number;
}

interface CheckTimelineProps {
  nextInterval?: Date;
  domain: [Date, Date];
  entries: Entry[];

  width: number;
  height: number;
}

const CheckTimeline = ({
  nextInterval,
  domain,
  entries,
  width,
  height,
}: CheckTimelineProps) => {
  const endDate = domain[1];
  const axisVisible = height >= minAxisHeight;
  const scheduleVisible = width >= minScheduleWidth;

  const barSize = {
    width: width - (scheduleVisible ? scheduleWidth + schedulePadding : 0),
    height: height - (axisVisible ? axisHeight + axisPadding : 0),
  };

  const scale = useMemo(
    () =>
      scaleTime()
        .domain(domain)
        .range([0, barSize.width]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...domain, barSize.width],
  );

  const segments = useMemo(
    () =>
      entries.reduce((acc: Segment[], entry: Entry) => {
        if (acc.length === 0) {
          return [{ status: entry.status, begin: entry.ts }];
        }

        const last = acc[acc.length - 1];
        if (last.status !== entry.status) {
          const rest = acc.slice(0, -1);
          return [
            ...rest,
            { ...last, end: entry.ts },
            { status: entry.status, begin: entry.ts },
          ];
        }

        return acc;
      }, []),
    [entries],
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g key="segments">
        {segments.map(({ status, begin, end }) => {
          const p1 = Math.max(scale(begin), 0);
          const p2 = scale(end || endDate);
          const width = p2 - p1;

          // avoid drawing bars outside of the frame
          if (p2 < 0) {
            return null;
          }

          return (
            <g key={`seg-${begin}`}>
              <Bar
                x={p1}
                y={0}
                height={barSize.height}
                width={width}
                status={status}
              />
              {width > 16 && (
                <StatusIcon
                  x={(p1 === 0 ? p1 + Math.min(width, 40) - 40 : p1) + 8}
                  y={12}
                  width={24}
                  height={24}
                  status={status}
                />
              )}
            </g>
          );
        })}
      </g>

      {axisVisible && <Axis x={0} y={height - axisHeight} scale={scale} />}

      {scheduleVisible && (
        <Schedule
          nextDate={nextInterval}
          date={endDate}
          height={barSize.height}
          width={scheduleWidth}
          x={width - scheduleWidth}
          y={0}
        />
      )}

      <ResultIndicatorLayer
        x={0}
        y={0}
        width={barSize.width}
        height={barSize.height}
        scale={scale}
        entries={entries}
      />
    </svg>
  );
};

export default CheckTimeline;
