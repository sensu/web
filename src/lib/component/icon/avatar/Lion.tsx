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
        <path fill="#F5C873" d="M32 28l29.7 42.5H2.2z" />
        <g transform="translate(3.8 2.5)" fill="#DC986E">
          <circle cx="28.1" cy="29.8" r="25.5" />
          <path d="M28 4.3l-2.3-1.7L21.4.2l1 4-4.8-1.6-6.2 1.6L14 6 8.7 8 5 10.3l-5 5.4h5l-4 6-1 6L2.6 26 1 33.4l.4 3 1 6.6L5 41.5l.8 4.2 2.9 3.9 2.7 2.6v-2.6l5.4 5 4 2.8 1.6-2.2zM28 4l2.5-1.5L34.8 0l-1 4 4.8-1.5L44.8 4 42 5.7l5.4 2 3.7 2.4 5 5.4h-5l3.9 6.1 1 5.9-2.5-1.6 1.5 7.3-.5 3-1 6.6-2.4-1.5-.8 4.2-2.9 4-2.7 2.5v-2.6l-5.5 5.1-4 2.7-1.6-2.2z" />
          <path d="M28.8 60.5L13.2 50l30.8-.5z" />
        </g>
        <g transform="translate(10.2 14.2)">
          <ellipse fill="#F5C873" cx="21.3" cy="19.3" rx="17.5" ry="16.8" />
          <circle fill="#F5C873" cx="7.5" cy="7.5" r="7.5" />
          <circle fill="#F5C873" cx="35" cy="7.5" r="7.5" />
          <path
            d="M36.9 11.7c1.7 0 3.1-1.9 3.1-3.6 0-1.7-1.7-3.4-3.5-3.4-1.7 0-3.4.1-3.4 1.9 0 1 1.4 1.9 2.3 3 .7.9.7 2.1 1.5 2.1zM6.2 11.7C4.5 11.7 3 9.8 3 8.1c0-1.7 1.7-3.4 3.4-3.4 1.8 0 3.5.1 3.5 1.9 0 1-1.4 1.9-2.3 3-.7.9-.8 2.1-1.5 2.1z"
            fill="#DDB56A"
          />
        </g>
        <g transform="translate(23 29)">
          <ellipse
            stroke="#000"
            fill="#000"
            cx="15.4"
            cy="2.7"
            rx="1.6"
            ry="2.7"
          />
          <ellipse
            stroke="#000"
            fill="#000"
            cx="1.6"
            cy="2.7"
            rx="1.6"
            ry="2.7"
          />
          <path
            fill="#414141"
            fillRule="nonzero"
            d="M7.6 10.6l-.1 1.2v2.8h2v-3.9z"
          />
          <path
            d="M9 11.2l-.5.4-1-.7a18 18 0 01-1.7-1.2l-.1-.2c-.9-.8-.9-2 .7-2.2h4.3c1.4.1 1.4 1.4.6 2.2-.3.4-.9.8-1.8 1.4l-.4.3zm-.4-2h-.2.2z"
            fill="#824747"
            fillRule="nonzero"
          />
          <path
            d="M2.7 15.7C4 16.5 5 17 5.8 17c.9 0 2-.4 3.2-1.2l.9-.5-1-1.7-1 .5c-1 .6-1.7 1-2 1-.5 0-1.2-.4-2.2-1l-.8-.5-1 1.7.8.5z"
            fill="#414141"
            fillRule="nonzero"
          />
          <path
            d="M8 15.7c1.3.8 2.3 1.2 3.2 1.2.8 0 1.8-.4 3.1-1.2l.9-.5-1-1.7-1 .5c-.9.6-1.6 1-2 1-.4 0-1-.3-2-.9l-1-.6-1 1.7.8.5z"
            fill="#414141"
            fillRule="nonzero"
          />
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Lion";

export default Icon;
