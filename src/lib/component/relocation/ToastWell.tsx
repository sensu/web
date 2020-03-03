import React from "/vendor/react";
import ResizeObserver from "/vendor/react-resize-observer";
import { useTransition, animated } from "/vendor/react-spring";
import { createStyles, makeStyles, Theme } from "/vendor/@material-ui/core";

import { useWell } from "/lib/component/relocation/Relocation";
import { TOAST } from "/lib/component/relocation/types";
import { UnmountObserver } from "/lib/component/util";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      toast: {
        position: "relative",
        left: 0,
        right: 0,
      },
      toastPadding: {
        [theme.breakpoints.up("md")]: {
          paddingBottom: 10,
          paddingRight: 10,
        },
      },
    }),
  { name: "ToastWell" },
);

interface RenderElProps {
  id: string;
  remove: () => void;
}

interface El {
  id: string;
  remove: () => void;
  props: {
    type: string;
    render: (_: RenderElProps) => React.ReactElement;
  };
}

const ToastWell = () => {
  const classes = useStyles();

  const elements = useWell() as El[];
  const visibleElements = elements
    .filter((item) => item.props.type === TOAST)
    .slice(-20);

  const [heights, setHeights] = React.useState({});
  const handleToastSize = React.useCallback(
    (id, rect) => {
      setHeights((heights) => {
        if (rect.height === heights[id]) {
          return null;
        }

        return { ...heights, [id]: rect.height };
      });
    },
    [setHeights],
  );

  const handleToastUnmount = React.useCallback(
    (id) => {
      setHeights((heights) => {
        if (heights[id] === undefined) {
          return null;
        }

        delete heights[id];
        return heights;
      });
    },
    [setHeights],
  );

  const transitions = useTransition(visibleElements, (el) => el.id, {
    from: { opacity: 0, height: 0 },
    update: ({ id }) => ({ opacity: 1, height: heights[id] || 0 }),
    leave: { opacity: 0, height: 0 },
    config: { tension: 210, friction: 20 },
  });

  return transitions.map(
    ({ item: { id, props, remove }, props: styles, key }) => (
      <animated.div key={key} style={styles} className={classes.toast}>
        <div style={{ position: "relative" }}>
          <ResizeObserver onResize={(rect) => handleToastSize(id, rect)} />
          <UnmountObserver onUnmount={() => handleToastUnmount(id)} />
          <div className={classes.toastPadding}>
            {props.render({ id, remove })}
          </div>
        </div>
      </animated.div>
    ),
  );
};

export default ToastWell;
