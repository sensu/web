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
        <g transform="translate(6 47)">
          <ellipse fill="#B4B4B4" cx="24.7" cy="24.4" rx="23.9" ry="24.4" />
          <ellipse fill="#D8D8D8" cx="25.3" cy="27.2" rx="8.9" ry="16.1" />
        </g>
        <g transform="translate(3 6)">
          <ellipse fill="#B4B4B4" cx="28.6" cy="26.8" rx="18.9" ry="18.3" />
          <path
            d="M33 44c1-2 4-2 10-2l5 2v3l3-3v-4l-2-3-1-2-3-3h4l5 3v-5l-1-2-2-1-3-3-4 3c-9 12-12 18-11 17zM25 44c-1-2-4-2-10-2l-5 2v3l-3-3v-4l2-3 1-2 3-3H9l-5 3v-5l1-2 2-1 3-3 4 3c9 12 12 18 11 17zM51 7c2 0 2 1 2 4l-6 11-11-11 15-4z"
            fill="#B4B4B4"
          />
          <path fill="#979797" d="M51 11l-5 9-3-3z" />
          <path d="M7 7c-2 0-3 1-2 4l6 11 11-11L7 7z" fill="#B4B4B4" />
          <path fill="#979797" d="M7 11l4 9 4-3z" />
          <g transform="translate(13 19)">
            <path
              d="M15 29c7 0 12-6 12-10s-5-8-12-8-12 4-12 8 5 10 12 10z"
              fill="#EFEFEF"
            />
            <path
              d="M19 15c2 1 6 0 7-3 2-3 3-8 0-9-2-2-6 1-8 4s-1 6 1 8zM12 15c-3 1-6 0-8-3-1-3-2-8 0-9 3-2 7 1 9 4s1 6-1 8z"
              fill="#EFEFEF"
            />
            <ellipse fill="#000" cx="21.5" cy="9.1" rx="2.2" ry="3.3" />
            <ellipse fill="#000" cx="9.3" cy="9.1" rx="2.2" ry="3.3" />
            <g transform="translate(10 16)" fill="#414141">
              <ellipse cx="5" cy="2.2" rx="5" ry="2.2" />
              <path fillRule="nonzero" d="M6 3H4v5h2z" />
              <path fillRule="nonzero" d="M5 6L4 7l4 5 2-2z" />
              <path fillRule="nonzero" d="M5 6l1 1-4 5-2-2z" />
            </g>
          </g>
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Wolf";

export default Icon;
