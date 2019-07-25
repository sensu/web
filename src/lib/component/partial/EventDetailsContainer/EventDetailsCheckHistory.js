/* eslint-disable react/prop-types */

import React, { useState, useEffect, useCallback } from "/vendor/react";

import { Group } from "@vx/group";
import { Bar } from "@vx/shape";
import { AxisBottom } from "@vx/axis";
import { scaleTime } from "@vx/scale";
import ResizeObserver from "/vendor/react-resize-observer";
import { Card, CardContent, Typography } from "/vendor/@material-ui/core";
import { useTheme } from "/vendor/@material-ui/styles";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { calcSplay, nextInterval } from "/lib/util/check";
// import gql from "/vendor/graphql-tag";

import { SmallCheckIcon, ErrorIcon, WarnIcon } from "/lib/component/icon";

const height = 80;
const lineHeight = 48;

const addEntry = (col, e) => {
  if (col.map[e.executed]) {
    return col;
  }

  const entry = { ...e, ts: new Date(e.executed) };

  let idx = col.list.findIndex(ee => ee.ts < entry.ts);
  if (idx === -1) {
    idx = 0;
  }

  return {
    list: [...col.list.slice(0, idx), entry, ...col.list.slice(idx)].slice(
      0,
      500,
    ),
    map: {
      ...col.map,
      [e.executed]: true,
    },
  };
};

const getColor = (palette, st) => {
  if (st === 0) {
    return palette.grey[300];
  } else if (st === 1) {
    return palette.warning;
  }
  return palette.critical;
};

const StatusIcon = ({ status, style = {}, ...extra }) => {
  let Component;
  let opacity = 0.178;
  if (status === 0) {
    Component = SmallCheckIcon;
    opacity = 0.71;
  } else if (status === 1) {
    Component = WarnIcon;
  } else {
    Component = ErrorIcon;
  }
  return (
    <Component
      style={{ ...style, color: `rgba(255,255,255,${opacity})` }}
      {...extra}
    />
  );
};
StatusIcon.displayName = "EventDetailsCheckHistory.StatusIcon";

const StyledBar = ({ status, ...extra }) => {
  const theme = useTheme();
  const color = getColor(theme.palette, status);

  return <Bar fill={color} {...extra} />;
};
StyledBar.displayName = "EventDetailsCheckHistory.Bar";

const ScheduleIndicator = ({ nextInterval, x, y }) => {
  const theme = useTheme();
  const bgColor = theme.palette.grey[300];

  return (
    <React.Fragment>
      <rect x={x} y={y} width={38} height={lineHeight} fill={bgColor} />
      <ScheduleIcon
        x={x + 8}
        y={y + 12}
        width={24}
        height={24}
        style={{ color: "rgba(255,255,255,0.71)" }}
      />
      <text
        x={x + 38 / 2}
        y={y + height - 11}
        textAnchor="middle"
        dominantBaseline="hanging"
        fontFamily="Arial"
        fontSize={10}
        fill="black"
      >
        <tspan>Now</tspan>
      </text>
    </React.Fragment>
  );
};

const Timeline = ({ nextInterval, entries, width }) => {
  const [currentTime, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const indicatorWidth = 38;
  const timelineWidth = width - indicatorWidth - 2;

  const domain = [
    entries.length > 0 ? entries[0].ts : currentTime,
    currentTime,
  ];
  const scale = scaleTime({
    domain,
    range: [0, timelineWidth],
  });

  const segments = entries.reduce((acc, entry) => {
    if (acc.length === 0) {
      return [{ status: entry.status, begin: entry.ts, end: currentTime }];
    }

    const rest = acc.slice(0, -1);
    const last = acc[acc.length - 1];
    if (last.status !== entry.status) {
      return [
        ...rest,
        { ...last, end: entry.ts },
        { status: entry.status, begin: entry.ts, end: currentTime },
      ];
    }

    return acc;
  }, []);

  return (
    <svg width={width} height={height}>
      <Group key="segs">
        {segments.map(({ status, begin, end }) => {
          const p1 = scale(begin);
          const p2 = scale(end);
          const width = p2 - p1;

          return (
            <Group key={`seg-${begin}`}>
              <StyledBar
                x={p1}
                y={0}
                height={lineHeight}
                width={width}
                status={status}
              />
              {width > 40 && (
                <StatusIcon
                  x={p1 + 8}
                  y={12}
                  width={24}
                  height={24}
                  status={status}
                />
              )}
            </Group>
          );
        })}
      </Group>

      <Group key="axis">
        <AxisBottom
          top={lineHeight + 8}
          left={0}
          scale={scale}
          stroke="#D8D8D8"
          strokeWidth={0.5}
          numTicks={5}
        />
      </Group>

      <Group key="indicator">
        <ScheduleIndicator x={width - indicatorWidth} y={0} nextInterval={nextInterval} />
      </Group>
    </svg>
  );
};

const EventDetailsCheckHistory = ({ name, interval, history = [] }) => {
  const [width, setWidth] = useState(0);
  const onResize = rect => setWidth(rect.width);

  const [entries, setEntries] = useState({
    map: {},
    list: [],
  });

  useEffect(() => {
    setEntries(prev => history.reduce((acc, e) => addEntry(acc, e), prev));
  }, [history]);

  const sorted = Object.assign([], entries.list).reverse();

  const splay = calcSplay(name);
  const nextInt = nextInterval(interval, splay);

  console.debug({ name, interval, splay, nextInt });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" paragraph>
          History
        </Typography>
        <div>
          <ResizeObserver onResize={useCallback(onResize, [])} />
        </div>
        <Timeline entries={sorted} width={width} nextInterval={nextInt} />
      </CardContent>
    </Card>
  );
};

export default EventDetailsCheckHistory;
