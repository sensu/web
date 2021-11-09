import React from "react";

export interface ANSIColorLazyProps
  extends Omit<React.HTMLProps<HTMLSpanElement>, "children"> {
  children?: string;
}

declare const ANSIColorLazy: React.FC<ANSIColorLazyProps>;
export default ANSIColorLazy;
