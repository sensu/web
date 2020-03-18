import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Global } from "@storybook/theming";
import {
  Separator,
  Icons,
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from "@storybook/components";
import { addons, types } from "@storybook/addons";
import { STORY_CHANGED } from "@storybook/core-events";

const id = "theme";

const Icon = () => (
  <svg viewBox="0 0 24 24">
    <path
      style={{ fill: "currentColor" }}
      d="m9,21c0,0.55 0.45,1 1,1l4,0c0.55,0 1,-0.45 1,-1l0,-1l-6,0l0,1zm3,-19c-3.86,0 -7,3.14 -7,7c0,2.38 1.19,4.47 3,5.74l0,2.26c0,0.55 0.45,1 1,1l6,0c0.55,0 1,-0.45 1,-1l0,-2.26c1.81,-1.27 3,-3.36 3,-5.74c0,-3.86 -3.14,-7 -7,-7z"
    />
  </svg>
);

const makeLink = (currentValue, onChange) => (value, title = value) => ({
  id: value,
  active: currentValue === value,
  title,
  value,
  onClick: () => onChange(value),
});

const ThemeSelector = ({ api }) => {
  const [expanded, setExpanded] = useState(false);
  const onVisibilityChange = useCallback(v => setExpanded(v));

  const [state, setState] = useState({ value: "sensu", dark: false });
  const setTheme = useCallback(
    next => {
      api.emit(`${id}/CHANGE`, next);
      setState(next);
    },
    [api, setState],
  );

  const onChangeValue = useCallback(
    value => {
      setExpanded(false);
      setTheme({
        ...state,
        value,
      });
    },
    [state, setTheme],
  );

  const onClickLights = useCallback(
    () =>
      setTheme({
        ...state,
        dark: !state.dark,
      }),
    [state, setTheme],
  );

  useEffect(() => {
    const emitValue = () => api.emit(`${id}/CHANGE`, state);
    api.on(STORY_CHANGED, emitValue);
    return () => api.off(STORY_CHANGED, emitValue);
  }, [state]);

  const createLink = makeLink(state.value, onChangeValue);
  const links = useMemo(() => [
    createLink("sensu", "Modern (default)"),
    createLink("classic", "Classic"),
    createLink("uchiwa", "Uchiwa"),
    createLink("deuteranomaly", "Deuteranomaly"),
    createLink("tritanomaly", "Tritanomaly"),
  ], [onChangeValue]);

  return (
    <React.Fragment>
      <Global
        styles={() => ({
          "#storybook-preview-background": {
            background: state.dark ? "#444" : "#f3f3f3",
          },
        })}
      />

      <Separator />

      <WithTooltip
        placement="top"
        trigger="click"
        tooltipShown={expanded}
        tooltip={<TooltipLinkList links={links} />}
        onVisibilityChange={onVisibilityChange}
        closeOnClick
      >
        <IconButton key="theme" active={state.value !== "sensu"} title="Change the active theme">
          <Icons icon="photo" />
        </IconButton>
      </WithTooltip>

      <IconButton onClick={onClickLights} active={state.dark}>
        <Icon />
      </IconButton>
    </React.Fragment>
  );
};

addons.register(id, api => {
  addons.add(id, {
    title: "Dark Mode",
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === "story",
    render: () => <ThemeSelector api={api} />,
  });
});
