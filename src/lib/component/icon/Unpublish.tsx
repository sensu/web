import React from "/vendor/react";
import { SvgIcon } from "/vendor/@material-ui/core";

const Icon = React.memo((props) => {
  return (
    <SvgIcon {...props}>
      <g fillRule="evenodd">
        <path fillRule="nonzero" d="M19 13h-4V7H9v6H5l7 7z" />
        <path d="M5 4v2h14V4z" />
      </g>
    </SvgIcon>
  );
});
Icon.displayName = "UnpublishIcon";

export default Icon;
