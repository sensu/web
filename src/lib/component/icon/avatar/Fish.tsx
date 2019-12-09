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
        <g transform="translate(5 7)" fill="none" fillRule="evenodd">
          <path
            d="M31 18l-4-6V8l3-4 5-3 4 3-1 2 1 2 8-2 3 2 2 2v2h-2v4l2 2 2 5v5l-2-2h-2v2l2 4-2 3-3 3-3 2-1 2h-4v-4l-1-3-3-4-6-3c3-1 3-4 2-10zM13 18v-6l-1-2 1-3 4-3c2-2 3-2 5-1l2 1v3l-2 1-1 2 1 1-1 2-2 1 3 4-5 3-4-3zM9 28l-2 6 2 5 3 5 3 2v-4l-3-5h3v-3l-3-2 1-3z"
            fill="#764FB6"
          />
          <path
            d="M19 31v6l3 5h2l5 4 6 4v-8h-2v-5h2v-3h-2l-2-3v-3l-12 3z"
            fill="#764FB6"
          />
          <path
            d="M35 20v-4l3-6 2 4v3h3l3 1-3 3-3 1 3 3v3l-3 3-1-3-1-3h-3v-5zM22 31v2l5 4v-3l2 1-1-2v-2l-1-3zM15 16v-4l3-4v4l-1 4-2 2z"
            fill="#412570"
          />
          <ellipse fill="#412570" cx="9.9" cy="30.2" rx="1" ry="1.2" />
          <ellipse fill="#ABABFF" cx="18.6" cy="23.1" rx="18.6" ry="7.6" />
          <g transform="translate(3 20)">
            <circle fill="#000" cx="1.7" cy="2.4" r="1.7" />
            <path d="M10 1l4-1 4 1v3h-3v2h-3l-2-2V1z" fill="#764FB6" />
            <path
              d="M6 0l1 2v2L6 7l1 1V7l1-3V1L7 0v-1L6 0z"
              fill="#414141"
              fillRule="nonzero"
            />
            <path d="M6 11v2l1 2-1 2v-2-4z" stroke="#412570" fill="#412570" />
          </g>
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Fish";

export default Icon;
