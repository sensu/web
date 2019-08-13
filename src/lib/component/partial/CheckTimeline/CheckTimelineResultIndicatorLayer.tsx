import React, { useState, useCallback, useRef } from "/vendor/react";

import { Tooltip } from "/vendor/@material-ui/core";
import { RelativeDate } from "/lib/component/base";
import ResultNeedle from "./CheckTimelineResultNeedle";

export interface ResultIndicatorLayerProps {
  x: number;
  y: number;

  width: number;
  height: number;

  scale(_: Date): number;
  entries: { ts: Date; status: number }[];

  ResultComponent?: React.ComponentType<ResultIndicator>;
}

interface ResultIndicator {
  x: number;
  y: number;

  dst: number;
  height: number;
  closest: boolean;
  status: number;
}

interface Line {
  x: number;
  dst: number;

  hovered: boolean;
  closest: boolean;

  ts: Date;
  status: number;
}

const ResultIndicatorLayer = React.memo(
  ({
    x,
    y,
    width,
    height,
    scale,
    entries,
    ResultComponent = ResultNeedle,
  }: ResultIndicatorLayerProps) => {
    const containerEl = useRef<SVGSVGElement>(null);
    const touchTarget = 8;

    const [mouseX, setMouseX] = useState<number | null>(null);
    const onLeave = useCallback(() => setMouseX(null), []);
    const onHover = useCallback(
      (ev) => {
        if (containerEl && containerEl.current) {
          const rect = containerEl.current.getBoundingClientRect();
          const x = ev.clientX - rect.left;
          setMouseX(x - (x % 2));
        }
      },
      [containerEl],
    );

    let lines: Line[] = [];
    let lineHovered = false;
    if (mouseX !== null) {
      lines = entries.reduce((acc: Line[], e) => {
        const x = scale(e.ts);
        if (x < 0) {
          return acc;
        }

        const mouseDst = Math.abs(x - mouseX);
        const hovered = !lineHovered && mouseDst < touchTarget / 2;
        if (hovered) {
          lineHovered = true;
        }

        const dst = 1 - Math.min(mouseDst / (width / 2), 1);
        if (acc.length === 0) {
          return [
            {
              x,
              dst,
              hovered,
              closest: true,
              ...e,
            },
          ];
        }

        const rest = acc.slice(0, -1);
        const last = acc[acc.length - 1];
        const closer = dst > last.dst;

        return [
          ...rest,
          {
            ...last,
            closest: last.closest && !closer,
          },
          {
            x,
            dst,
            hovered,
            closest: closer,
            ...e,
          },
        ];
      }, []);
    }

    return (
      <svg
        ref={containerEl}
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseMove={onHover}
        onMouseLeave={onLeave}
      >
        <rect x={0} y={0} width={width} height={height} fill="transparent" />
        {lines.map(({ ts, hovered, ...line }) => {
          const indicator = <ResultComponent y={0} height={height} {...line} />;

          if (!hovered) {
            return indicator;
          }
          return (
            <Tooltip
              key={ts.toString()}
              title={
                <RelativeDate
                  to={new Date()}
                  dateTime={ts}
                  precision="seconds"
                />
              }
              aria-label={ts.toString()}
              open
            >
              {indicator}
            </Tooltip>
          );
        })}
      </svg>
    );
  },
);
ResultIndicatorLayer.displayName = "CheckTimeline.ResultIndicatorLayer";

export default ResultIndicatorLayer;
