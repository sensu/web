import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fillRule="evenodd">
        <defs>
          <linearGradient id="es" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="15%" stopColor="currentColor" stopOpacity=".33" />
            <stop offset="85%" stopColor="currentColor" />
          </linearGradient>
        </defs>
        <g fillRule="evenodd">
          <path d="M17 12.8l2.2-.6c1.3-.4 2.5.4 2.5 1.8 0 1.9-2.7 4.2-8 7h-.1c-1 .4-2.2.5-3.6.5-4.6 0-7-1.5-7-9.9h14v1.2zm-.3 4.6c2-1 2.9-2 2.9-2.7 0-.8-.5-1.2-1.4-.8l-1.1.3c0 .5 0 1-.2 1.6l-.2 1.6z" />
          <path
            d="M9.9 2c.3-.2.5-.2.7 0 .2.2.2.4 0 .7-.4.5-.3 1.2-.3 1.6l.8 1.5c.7 1.2.7 1.6.7 2 0 .7-.5 1.5-1.2 2.1-.2.3-.5.3-.7.1-.2-.2-.2-.4 0-.7.5-.5.3-1 .3-1.4 0-.3-.3-.6-.8-1.5-.6-1.1-.7-1.6-.7-2 0-.8.6-1.6 1.2-2.4z"
            fill="url(#es)"
            fillRule="nonzero"
          />
        </g>
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "EspressoIcon";

export default Icon;
