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
        <g transform="translate(11 23)">
          <ellipse fill="#414141" cx="19.3" cy="33.4" rx="19.3" ry="33.4" />
          <ellipse fill="#EFEFEF" cx="19.3" cy="34.6" rx="14.6" ry="26.4" />
        </g>
        <ellipse
          cx="13.4"
          cy="11.7"
          rx="12.9"
          ry="11.7"
          transform="translate(17 8)"
          fill="#414141"
        />
        <g transform="translate(17 15)">
          <path
            d="M14 25c4 0 8-1 8-4 0-2-4-5-8-5s-8 3-8 5c0 3 4 4 8 4z"
            fill="#DDB56A"
          />
          <ellipse fill="#FFF" cx="16.3" cy="3.5" rx="1.8" ry="3.5" />
          <ellipse fill="#FFF" cx="23.9" cy="3.5" rx="1.2" ry="3.5" />
          <path
            d="M8 17l4-2v-2l-3-1-4-1v2l3 4zM19 17l-3-2v-2l3-1 4-1v2c-1 3-2 3-4 4z"
            fill="#DDB56A"
          />
          <path
            d="M14 23c3 0 6-10 6-11l-6 2-6-2c0 1 3 11 6 11z"
            fill="#DDB56A"
          />
          <path d="M20 5l8 2 6 5 1 3-1 2-1 1-8-4h-9l-2-1 6-8z" fill="#414141" />
          <path
            d="M34 18l1-2-3-3-3-2-1-1-7-2h-1l-1 2 1 1 6 1 1 1 3 2 3 2 1 1z"
            fill="#DC986E"
            fillRule="nonzero"
          />
          <path d="M4 9h5L7 5 4 3C2 3 2 4 1 6l3 3z" fill="#DC986E" />
        </g>
      </Bg>
    </SvgIcon>
  );
});
Icon.displayName = "Avatar.Lion";

export default Icon;
