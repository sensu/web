import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <defs>
        <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset=" 20%" stopColor="currentColor" stopOpacity=".71" />
          <stop offset="80%" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <path
        fill="url(#a)"
        fillRule="nonzero"
        d="M13.5.7s.7 2.6.7 4.8c0 2-1.3 3.7-3.4 3.7-2 0-3.6-1.7-3.6-3.7V5C5.2 7.5 4 10.6 4 14a8 8 0 1 0 16 0A17 17 0 0 0 13.5.7zM11.7 19a3.2 3.2 0 0 1-3.2-3.1c0-1.7 1-2.8 2.8-3.2a7.7 7.7 0 0 0 4.6-2.5c.4 1.3.6 2.6.6 4 0 2.7-2.1 4.8-4.8 4.8z"
      />
    </SvgIcon>
  );
});
Icon.displayName = "FlameIcon";

export default Icon;
