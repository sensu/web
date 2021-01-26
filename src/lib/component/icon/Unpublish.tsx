import React from "/vendor/react";
import createSvgIcon from "./createSvgIcon";

const Icon = createSvgIcon(
  <g fillRule="evenodd">
    <path fillRule="nonzero" d="M19 13h-4V7H9v6H5l7 7z" />
    <path d="M5 4v2h14V4z" />
  </g>,
  "UnpublishIcon",
);

export default Icon;
