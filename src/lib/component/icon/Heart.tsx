import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <path
        d="M2 8c0-2.5 2.5-4 5-4 1.7 0 3.3 1.3 5 4 1.7-2.7 3.3-4 5-4 2.5 0 5 1.5 5 4 0 4-3.3 8.7-10 14C5.3 16.7 2 12 2 8z"
        fillRule="evenodd"
      />
    </SvgIcon>
  );
});
Icon.displayName = "HeartIcon";

export default Icon;
