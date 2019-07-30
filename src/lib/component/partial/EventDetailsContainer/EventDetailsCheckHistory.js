/* eslint-disable react/prop-types */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "/vendor/react";

import { Group } from "@vx/group";
import { Bar } from "@vx/shape";
import { AxisBottom } from "@vx/axis";
import { scaleTime } from "@vx/scale";
import ResizeObserver from "/vendor/react-resize-observer";
import {
  Card,
  CardContent,
  Typography,
  Tooltip,
} from "/vendor/@material-ui/core";
import { useTheme } from "/vendor/@material-ui/styles";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { calcSplay, nextInterval } from "/lib/util/check";
import { RelativeDate } from "/lib/component/base";
import { useCurrentDate } from "/lib/component/util";
import {
  darken,
  emphasize,
} from "/vendor/@material-ui/core/styles/colorManipulator";
// import gql from "/vendor/graphql-tag";

import { SmallCheckIcon, ErrorIcon, WarnIcon } from "/lib/component/icon";

/*
 * Constants
 */

const height = 80;
const lineHeight = 48;
const maxItems = 128;
const indicatorWidth = 38;

const addEntry = (col, e) => {
  if (col.map[e.executed]) {
    return col;
  }

  const entry = { ...e, ts: new Date(e.executed) };

  let idx = col.list.findIndex(ee => ee.ts < entry.ts);
  if (idx === -1) {
    idx = 0;
  }

  const list = [...col.list.slice(0, idx), entry, ...col.list.slice(idx)];

  return {
    list: list.slice(0, maxItems),
    map: {
      ...col.map,
      [e.executed]: true,
    },
  };
};

const getGrey = palette => emphasize(palette.background.paper, 0.083);

const getColor = (palette, status) => {
  switch (status) {
    case 0:
      return getGrey(palette);
    case 1:
      return palette.warning;
    default:
  }
  return palette.critical;
};

const StatusIcon = ({ status, style = {}, ...extra }) => {
  let Component = ErrorIcon;
  let opacity = 0.178;
  if (status === 0) {
    Component = SmallCheckIcon;
    opacity = 0.71;
  } else if (status === 1) {
    Component = WarnIcon;
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

const ScheduleIndicator = ({ date, nextDate, x, y }) => {
  const theme = useTheme();
  const bgColor = getGrey(theme.palette);

  return (
    <React.Fragment>
      <Tooltip
        title={
          <RelativeDate dateTime={nextDate} precision="seconds" to={date} />
        }
        aria-label="next occurrence"
      >
        <rect x={x} y={y} width={38} height={lineHeight} fill={bgColor} />
      </Tooltip>
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

const StatusIndicators = ({ x, y, width, height, scale, entries }) => {
  const containerEl = useRef();

  const [mouseX, setMouseX] = useState(null);
  const onHover = useCallback(
    ev => {
      const rect = containerEl.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      setMouseX(x - (x % 2));
    },
    [containerEl],
  );

  return (
    <svg
      ref={containerEl}
      x={x}
      y={y}
      width={width}
      height={height + 3}
      onMouseMove={onHover}
    >
      <rect x={0} y={0} width={width} height={height} fill="transparent" />
      <Group stroke="rgba(255,255,255,0.87)">
        {entries.map(({ ts, status }) => {
          const x = scale(ts);

          return (
            <IndicatorLine
              key={ts.toString()}
              x={x}
              width={width}
              mouseX={mouseX}
              ts={ts}
              status={status}
            />
          );
        })}
      </Group>
    </svg>
  );
};

const IndicatorLine = ({ x, mouseX, ts, width, status }) => {
  const theme = useTheme();

  const frameW = 8;
  const midX = x + frameW / 2;
  const mouseDst =
    mouseX !== null
      ? 1 - Math.min(Math.abs(midX - mouseX) / (width / 2), 1)
      : 0;

  const t = mouseDst ** 24 * 9;
  const c = darken(getColor(theme.palette, status), 0.41);

  return (
    <React.Fragment>
      <Group stroke={c} fill={c}>
        <polygon
          points={`${x - t / 2}, 0 ${x + t / 2}, 0 ${x}, ${t}`}
          strokeWidth={0}
        />
        <line
          x1={x}
          x2={x}
          y1={0}
          y2={lineHeight}
          strokeWidth={mouseDst ** 8 * 1.41}
        />
      </Group>
      <Tooltip
        title={
          <RelativeDate to={new Date()} dateTime={ts} precision="seconds" />
        }
        aria-label={ts.toString()}
      >
        <rect
          x={x - frameW / 2}
          y={0}
          height={lineHeight}
          width={frameW}
          strokeWidth={0}
          fill="transparent"
        />
      </Tooltip>
    </React.Fragment>
  );
};

const Timeline = ({ nextInterval, currentTime, domain, entries, width }) => {
  const timelineWidth = width - indicatorWidth - 2;

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
        <ScheduleIndicator
          nextDate={nextInterval}
          date={currentTime}
          x={width - indicatorWidth}
          y={0}
        />
      </Group>

      <Group key="orbs">
        <StatusIndicators
          x={0}
          y={0}
          width={timelineWidth}
          height={lineHeight}
          scale={scale}
          entries={entries}
        />
      </Group>
    </svg>
  );
};

const EventDetailsCheckHistory = ({ name, interval, history = [] }) => {
  const currentTime = useCurrentDate();

  const [width, setWidth] = useState(0);
  const onResize = useCallback(rect => setWidth(rect.width), []);

  const [entries, setEntries] = useState({ map: {}, list: [] });
  useEffect(() => {
    setEntries(prev => history.reduce((acc, e) => addEntry(acc, e), prev));
  }, [history]);

  const sorted = entries.list.slice(0).reverse().slice(0,24);
  const domain = [sorted[0] ? sorted[0].ts : currentTime, currentTime];

  const splay = useMemo(() => calcSplay(name), [name]);
  const nextInt = nextInterval(interval, splay, currentTime);

  return (
    <Card>
      <CardContent>
        <ResizeObserver onResize={onResize} />
        <Typography variant="h6" paragraph>
          History
        </Typography>
        <Timeline
          entries={sorted}
          width={width}
          interval={interval}
          name={name}
          currentTime={currentTime}
          nextInterval={nextInt}
          domain={domain}
        />
      </CardContent>
    </Card>
  );
};

export default EventDetailsCheckHistory;
