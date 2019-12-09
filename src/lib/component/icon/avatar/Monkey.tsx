import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";
import Bg from "./Bg";

interface Props {
  color: string;
}

const Icon = React.memo(({ color, ...props }: Props) => {
  return (
    <SvgIcon viewBox="0 0 64 64" {...props}>
      <Bg color={color}>
        <path
          d="M32 39c9 0 17 9 17 20a32 32 0 01-34 0c0-11 8-20 17-20z"
          fill="#7B5A3A"
        />
        <path
          d="M47 35c2 0 6-3 6-6s-4-6-6-6l1 6-1 6zM17 35c-2 0-6-3-6-6s4-6 6-6l-1 6 1 6z"
          fill="#D1BD97"
        />
        <ellipse fill="#7B5A3A" cx="32" cy="28" rx="17" ry="16" />
        <ellipse fill="#D1BD97" cx="32.5" cy="38" rx="9.5" ry="7" />
        <ellipse fill="#D1BD97" cx="27.2" cy="26.6" rx="7.5" ry="8.5" />
        <ellipse fill="#D1BD97" cx="37.2" cy="26.6" rx="7.5" ry="8.5" />
        <ellipse fill="#000" cx="38" cy="26.5" rx="2" ry="3.5" />
        <ellipse fill="#000" cx="27" cy="26.5" rx="2" ry="3.5" />
        <path d="M33 41c3 0 5-2 5-3H27c0 1 2 3 6 3z" fill="#FFF" />
        <circle fill="#414141" cx="31.5" cy="34.5" r="1" />
        <circle fill="#414141" cx="33.5" cy="34.5" r="1" />
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Monkey";

export default Icon;
