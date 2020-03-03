/* eslint-disable react/prop-types */

import React from "/vendor/react";
import { useTransition, animated } from "/vendor/react-spring";
import { createStyles, makeStyles } from "/vendor/@material-ui/core";
import ResizeObserver from "/vendor/react-resize-observer";

import { UnmountObserver } from "/lib/component/util";

import { useWell } from "/lib/component/relocation/Relocation";
import { BANNER } from "/lib/component/relocation/types";

const MAX_BANNERS = 20;

const zIndices = {};

// Include additional styles to account for transitioning elements that may
// increase the visible count beyond the max.
for (let i = 0; i < MAX_BANNERS + 5; i += 1) {
  zIndices[`&:nth-child(${i})`] = { zIndex: MAX_BANNERS + 5 - i };
}

const useStyles = makeStyles(
  () =>
    createStyles({
      container: {
        position: "relative",
        marginTop: -8,
        top: 8,
        paddingBottom: 8,
        overflow: "hidden",
      },
      banner: {
        position: "relative",
        ...zIndices,
      },
      bannerInner: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
      },
    }),
  { name: "BannerWell" },
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

interface Props {
  elements: El[];
}

const BannerWellContainer = () => {
  const elements = useWell() as El[];
  const visibleElements = elements
    .filter((item) => item.props.type === BANNER)
    .slice(-20)
    .reverse();

  return <BannerWell elements={visibleElements} />;
};

const BannerWell = ({ elements }: Props) => {
  const classes = useStyles();

  const [heights, setHeights] = React.useState({});
  const handleBannerSize = React.useCallback(
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

  const handleBannerUnmount = React.useCallback(
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

  const transitions = useTransition(elements, (el) => el.id, {
    from: { opacity: 0, height: 0 },
    leave: { opacity: 0, height: 0 },
    update: ({ id }) => ({ opacity: 1, height: heights[id] || 0 }),
    config: { tension: 210, friction: 20 },
  });

  return (
    <div className={classes.container}>
      {transitions.map(({ item: { id, props, remove }, props: style, key }) => (
        <animated.div key={key} style={style} className={classes.banner}>
          <div className={classes.bannerInner}>
            <ResizeObserver onResize={(rect) => handleBannerSize(id, rect)} />
            <UnmountObserver onUnmount={() => handleBannerUnmount(id)} />
            {props.render({ id, remove })}
          </div>
        </animated.div>
      ))}
    </div>
  );
};

export default React.memo(BannerWellContainer);
