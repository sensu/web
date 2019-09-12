import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fillRule="evenodd">
        <path d="M12 21.6c-.5 0-1-.4-2-1.3C4.5 15.8 2 11.6 2 8c0-2.5 2.5-4 5-4 1.3 0 2.4 1 4 2.5.5.5.8.8 1 .7" />
        <path
          d="M12 21.6c.5 0 1-.4 2-1.3 5.5-4.5 8-8.7 8-12.3 0-2.5-2.5-4-5-4-1.3 0-2.4 1-4 2.5-.5.5-.7.8-1 .7"
          opacity=".5"
        />
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "FlameIcon";

export default Icon;
