/* eslint-disable react/prop-types */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "/vendor/react";
import gql from "/vendor/graphql-tag";

import ResizeObserver from "/vendor/react-resize-observer";
import { Card, CardContent, Typography } from "/vendor/@material-ui/core";
import { useTheme } from "/vendor/@material-ui/styles";
import { calcSplay, nextInterval } from "/lib/util/check";
import { useCurrentDate } from "/lib/component/util";
import CheckTimeline from "/lib/component/partial/CheckTimeline";

/*
 * Constants
 */

const timelineHeight = 80;
const maxItems = 128;

/*
 * Types
 */

interface CheckHistoryEntry {
  status: number;
  executed: string;
}

interface Timeline {
  ids: number[];
  entries: TimelineEntry[];
}

interface TimelineEntry {
  ts: Date;
  status: number;
}

interface Theme {
  spacing(): number;
}

interface EventDetailsCheckHistoryProps {
  check: {
    name: string;
    interval: number;
    cron: string;
    publish: boolean;
    history: CheckHistoryEntry[];
  };
}

/*
 * Util
 */

const toEntry = ({ status, executed }: CheckHistoryEntry) => ({
  status,
  ts: new Date(executed),
});

const addEntry = (col: Timeline, e: TimelineEntry) => {
  const ts = e.ts.getTime();
  if (col.ids.indexOf(ts) >= 0) {
    return col;
  }

  let idx = col.entries.findIndex((ee) => ee.ts < e.ts);
  if (idx === -1) {
    idx = 0;
  }

  const entries = [...col.entries.slice(0, idx), e, ...col.entries.slice(idx)];

  return {
    ids: [ts, ...col.ids],
    entries: entries.slice(0, maxItems),
  };
};

/*
 * Component
 */

const Content = (props: object) => {
  const theme = useTheme() as Theme;
  return <CardContent style={{ paddingBottom: theme.spacing() }} {...props} />;
};

const EventDetailsCheckHistory = ({
  check: { name, interval, publish, history = [] },
}: EventDetailsCheckHistoryProps) => {
  const currentTime = useCurrentDate(1000, 1000);

  const [width, setWidth] = useState(0);
  const onResize = useCallback((rect) => setWidth(rect.width), []);

  // Store check history in state, so that we can display more than 20 entries
  const [t, setT] = useState<Timeline>({ ids: [], entries: [] });
  useEffect(() => {
    setT((prev) => history.reduce((acc, e) => addEntry(acc, toEntry(e)), prev));
  }, [history]);

  // Using timestamp of the 20th check result, find a range of entries to display.
  const range: number = useMemo(() => {
    if (t.entries.length > 0) {
      return (
        currentTime.getTime() -
        t.entries[Math.min(t.entries.length, 20) - 1].ts.getTime()
      );
    }
    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.min(t.entries.length, 20)]);

  const domain: [Date, Date] = [
    new Date(currentTime.getTime() - range),
    currentTime,
  ];

  const splay = useMemo(() => calcSplay(name), [name]);

  let nextInt: Date | undefined;
  if (publish && interval > 0) {
    nextInt = nextInterval(interval, splay, currentTime);
  }

  const sorted = t.entries.slice(0).reverse();

  return (
    <Card>
      <Content>
        <div>
          <ResizeObserver onResize={onResize} />
        </div>
        <Typography variant="h5" paragraph>
          Timeline
        </Typography>
        <CheckTimeline
          entries={sorted}
          nextInterval={nextInt}
          domain={domain}
          width={width}
          height={timelineHeight}
        />
      </Content>
    </Card>
  );
};
EventDetailsCheckHistory.fragments = {
  check: gql`
    fragment EventDetailsCheckHistory_check on Check {
      name
      interval
      cron
      publish
      history {
        status
        executed
      }
    }
  `,
};

export default EventDetailsCheckHistory;
