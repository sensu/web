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
        <g transform="translate(12.3 36.7)">
          <ellipse fill="#D99156" cx="19.5" cy="23.5" rx="19.5" ry="23.5" />
          <ellipse fill="#EFEFEF" cx="19.5" cy="28.1" rx="10.3" ry="12.1" />
        </g>
        <g transform="translate(6 3.7)">
          <ellipse fill="#D99156" cx="25.9" cy="26.1" rx="19.5" ry="18.4" />
          <ellipse fill="#2D2D2D" cx="32.8" cy="26.7" rx="2.3" ry="4" />
          <ellipse fill="#2D2D2D" cx="19" cy="26.7" rx="2.3" ry="4" />
          <ellipse fill="#EFEFEF" cx="26.4" cy="37.6" rx="10.9" ry="8" />
          <path
            d="M45 5.5c1.2.2 1.8 1.3 1.5 3.4-.2 2-1.2 5.5-3 10.3L32 9.8l13-4.3zM7 5.5C5.6 5.7 5.1 6.8 5.3 9c.2 2 1.2 5.5 3 10.3L20 9.8 7 5.5z"
            fill="#D99156"
          />
          <circle fill="#EFEFEF" cx="21.8" cy="20.9" r="1.7" />
          <circle fill="#EFEFEF" cx="29.9" cy="20.9" r="1.7" />
          <path
            d="M23.1 45.1c2.6 0-3-4.1-3-7 0-2 2.7-4.3 1.2-5.1-.6-.4-5 0-5.8 0-2.5 0-9.1-6.9-9.1-4 0 1.6 1.4 6.8 4 9.7 2 2.1 11.6 6.4 12.7 6.4zM31 44.5c-2.3 1.3 1-3.5 1-6.4 0-2-2.6-4.3-1-5.1.5-.4 5 0 5.7 0 2.5 0 8.3-6.9 8.3-4 0 1.6-.4 6.3-3 9.1A44 44 0 0133 44c-1.8.9-1.7.3-2.2.6z"
            fill="#EFEFEF"
          />
          <g fillRule="nonzero">
            <path fill="#414141" d="M25.4 35v4.6h2.3V35z" />
            <path
              d="M25.3 40.5v-.3-2.9h2.3v1.1c.1 2 0 3.1-.7 3.8-.7.6-2.4 1-3.7.7H23l-.3-.2-3-1.5-1-.5 1-2 2.2 1 1.1.6.8.4c.5.1 1.2 0 1.5-.2z"
              fill="#414141"
            />
            <path
              d="M28.3 40.5a8 8 0 01-.1-.9l-.1-.5-.1-.5-.3-2.2-.1-1.5-2.3.2.2 1.9.1 1c.3 2.5.6 3.7 1.1 4.2.7.6 2.4 1 3.8.7a13 13 0 002.5-1.4l1.4-1-1.2-2-1.4 1-2 1.2c-.5.1-1.3 0-1.5-.2z"
              fill="#414141"
            />
            <path
              d="M26.8 36.6l-.3.1-.9-.5a17 17 0 01-2-1.4c-.7-.6-.7-1.4.3-1.6H29c.6 0 1 .1 1 .7 0 .3-.2.6-.6.9l-2 1.4-.6.4z"
              fill="#916C47"
            />
          </g>
          <path
            fill="#EFEFEF"
            d="M43.3 10.2l-1.6 6.3-4.3-3.8zM8.4 10.2l1.6 6.3 4.4-3.8z"
          />
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Dog";

export default Icon;
