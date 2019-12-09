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
        <g transform="translate(5 -3)" fill="none" fillRule="evenodd">
          <path
            d="M31 73c11 0 24-9 24-20S42 34 31 34c-6 0-12-3-16 1-3 3-4 13-4 18 0 4 0 13 2 16 3 6 10 4 18 4z"
            fill="#CF5B5B"
          />
          <path
            d="M36 10c4 0 4 1 0 6l-2 4 2 7 5 7c4 3 5 3 4 5 0 2-6 1-16-1H11l-8-1-2-2 10-8 9-10 8-4 8-3z"
            fill="#CF5B5B"
          />
          <path
            d="M19 44c4 0 7-4 7-9 0-6 0-13-4-13l-8 2-1 1v10l-2 9c0 3 7 0 8 0z"
            fill="#414141"
          />
          <path
            d="M13 25l3 8v5h-3c-5 1-8 0-10-1l-2-2 4-4 8-6z"
            fill="#CF7D5B"
          />
          <ellipse
            fill="#BC5050"
            transform="rotate(-23 46 54)"
            cx="45.8"
            cy="53.7"
            rx="10.2"
            ry="19.3"
          />
          <circle fill="#FFF" cx="21.4" cy="26.2" r="2.1" />
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Bird";

export default Icon;
