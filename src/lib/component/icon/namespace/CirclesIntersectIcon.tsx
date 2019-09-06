import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fillRule="evenodd">
        <path d="M12 12a5 5 0 0 0 5 5v.2a5 5 0 1 1-5.2-5.2h.2zm0-10a5 5 0 0 1 .2 10H12a5 5 0 0 0-5-5v-.2A5 5 0 0 1 12 2z" />
        <path
          d="M17 7.2V7a5 5 0 1 1-5 5.2V12a5 5 0 0 0 5-4.8V7zM7 7a5 5 0 0 1 5 4.8v.2a5 5 0 0 0-5 4.8v.2A5 5 0 0 1 7 7z"
          opacity=".5"
        />
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "ShieldIcon";

export default Icon;
