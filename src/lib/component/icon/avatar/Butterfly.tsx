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
        <g transform="translate(2 9)" fill="none" fillRule="evenodd">
          <circle fill="#EFEFEF" cx="3.5" cy="30.5" r="1.5" />
          <path
            d="M29 46c3 0 6-10 6-22 0-11-3-19-6-19s-6 8-6 19c0 12 3 22 6 22z"
            fill="#414141"
          />
          <path
            d="M30 13h4l2-5c0-2-3-4-6-4-4 0-7 2-7 4s0 4 2 5h5z"
            fill="#414141"
          />
          <g transform="translate(0 12)">
            <path
              d="M20 31c1 0 4 2 6 0 1-2 2-3 2-7 1-10 0-16-1-17-2-1-5 6-7 11l-3 8c-1 2 2 4 3 5z"
              fill="#2D2D2D"
            />
            <path
              d="M20 29c1 1 4 2 5 0 1-1 2-2 2-6l-1-13c-2-1-4 4-6 9l-3 6c0 2 2 4 3 4z"
              fill="#D99156"
            />
            <path
              d="M14 28c-2-1-14-6-14-9s6-9 9-12c6-4 15-8 18-7 3 2 0 8-3 16-4 7-7 13-10 12z"
              fill="#2D2D2D"
            />
            <path
              d="M14 26c-1 0-12-4-12-6 0-3 5-7 7-10 5-3 13-8 16-7 2 1-1 8-3 14-3 5-5 10-8 9z"
              fill="#D99156"
            />
            <path
              d="M23 22l2 1 2-1 1-4v-2l-1-7c-1-1-2 0-3 4l-2 3-1 3 2 3zm-1-3l1-2v-1l1-2 3-4v8l-1 3-1 1-1-1-2-2z"
              fill="#2D2D2D"
              fillRule="nonzero"
            />
            <path
              d="M24 16h3v-4-3c-1-1-1 0-2 2l-1 2-1 1 1 2zm0-2l1-1 1-2v-1 5h-1l-1-1zM15 18a62 62 0 01-4-2c-2 0-3-1-3-2 0-2 3-5 6-7 4-3 10-6 12-5v4l-2 6-1 1c-2 5-4 7-6 6l-2-1zm7-6l1-1 2-5V5 3c-1-1-7 2-11 5l-5 6 2 1v1a31 31 0 005 1v1h2c1 1 2-1 4-6z"
              fill="#2D2D2D"
              fillRule="nonzero"
            />
            <path
              d="M19 13a42 42 0 01-3-1l-2-2 4-5c2-2 6-4 8-3v3l-1 3-1 1c-1 3-2 5-4 4h-1zm1-1c1 1 2-1 3-3l1-1V7l1-3V3l-7 3-3 4h1v1a21 21 0 003 1h1z"
              fill="#2D2D2D"
              fillRule="nonzero"
            />
            <circle fill="#EFEFEF" cx="18.9" cy="27" r="1.5" />
            <circle fill="#EFEFEF" cx="8.2" cy="22.2" r="1.5" />
            <circle fill="#EFEFEF" cx="13.1" cy="24.1" r="1.5" />
            <circle fill="#EFEFEF" cx="22.8" cy="29" r="1.5" />
            <circle fill="#EFEFEF" cx="3.4" cy="19.2" r="1.5" />
            <path
              fill="#2D2D2D"
              fillRule="nonzero"
              d="M17 11l1 1 8-10h-1zM10 16l-1-1-5 8 1 1zM15 18l-1-1-5 8 1 1zM24 22l-1-1-4 9h1zM24 22h1l1-6-1-1zM17 18l1 1 3-6-1-1zM9 14v1l6-5-1-1z"
            />
          </g>
          <g transform="matrix(-1 0 0 1 60 12)">
            <path
              d="M20 31c1 0 5 2 7 0 0-2 2-3 2-7L28 7c-2-1-5 6-8 11l-3 8c0 2 2 4 3 5z"
              fill="#2D2D2D"
            />
            <path
              d="M20 29c1 1 5 2 6 0 1-1 2-2 2-6 0-8 0-13-2-13-1-1-4 4-6 9l-3 6c0 2 3 4 3 4z"
              fill="#D99156"
            />
            <path
              d="M14 28c-1-1-14-6-14-9s6-9 9-12c6-4 16-8 19-7 3 2 0 8-4 16-3 7-7 13-10 12z"
              fill="#2D2D2D"
            />
            <path
              d="M15 26c-2 0-13-4-13-6 0-3 5-7 8-10 4-3 13-8 16-7 2 1-1 8-4 14-2 5-5 10-7 9z"
              fill="#D99156"
            />
            <path
              d="M24 22l1 1 3-1 1-4v-1l-1-8c-1-1-2 0-4 4l-1 3-1 1v2l2 3zm0-1l-1-2 1-2v-1l1-2 2-4 1 8-1 3-2 1-1-1z"
              fill="#2D2D2D"
              fillRule="nonzero"
            />
            <path
              d="M25 16h2l1-2v-2l-1-3-2 2-1 2v1l1 2zm2-6v5h-2v-1-1l1-1a16 16 0 011-2z"
              fill="#2D2D2D"
              fillRule="nonzero"
            />
            <path
              d="M13 17l-2-1-2-2c0-2 2-5 5-7 4-3 10-6 12-5l1 4-2 5-1 2-1 1c-2 4-3 6-5 5l-2-1-3-1zm10-4v-1l1-2 2-4V5 3c-2-1-7 2-11 5-3 2-5 5-5 6l1 1 1 1a33 33 0 004 1l1 1h1c1 1 3-1 5-5z"
              fill="#2D2D2D"
              fillRule="nonzero"
            />
            <path
              d="M19 13a43 43 0 01-3-1l-2-2 4-5h1c2-2 6-4 7-3l1 2v1l-1 2-1 2c-2 3-3 5-4 4h-2zm2-1c1 1 2-1 3-3V8l1-1 1-2V4 3c-1-1-5 1-7 3l-4 4 2 1a22 22 0 002 1h2z"
              fill="#2D2D2D"
              fillRule="nonzero"
            />
            <circle fill="#EFEFEF" cx="19.4" cy="27" r="1.5" />
            <circle fill="#EFEFEF" cx="8.4" cy="22.2" r="1.5" />
            <circle fill="#EFEFEF" cx="13.4" cy="24.1" r="1.5" />
            <circle fill="#EFEFEF" cx="23.4" cy="29" r="1.5" />
            <circle fill="#EFEFEF" cx="3.4" cy="19.2" r="1.5" />
            <path
              fill="#2D2D2D"
              fillRule="nonzero"
              d="M18 11l1 1 7-10h-1zM10 16l-1-1-5 8 1 1zM15 18l-1-1-5 8 1 1zM24 22l-1-1-3 9h1zM25 22h1l1-6-1-1zM18 18l1 1 2-6-1-1zM9 14v1l6-5V9z"
            />
          </g>
          <g transform="translate(9)">
            <path
              fill="#2D2D2D"
              fillRule="nonzero"
              d="M23 6h1l3-6h-1zM18 6h-1l-3-6h1z"
            />
            <circle fill="#EFEFEF" cx="1" cy="26" r="1" />
            <circle fill="#EFEFEF" cx="5" cy="28" r="1" />
            <circle fill="#EFEFEF" cx="40" cy="26" r="1" />
            <circle fill="#EFEFEF" cx="36" cy="28" r="1" />
            <circle fill="#EFEFEF" cx="16" cy="32" r="1" />
            <circle fill="#EFEFEF" cx="25" cy="32" r="1" />
            <circle fill="#EFEFEF" cx="8" cy="21" r="1" />
            <circle fill="#EFEFEF" cx="33" cy="21" r="1" />
          </g>
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Butterfly";

export default Icon;
