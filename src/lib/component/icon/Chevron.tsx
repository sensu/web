import React from "/vendor/react";
import Left from "@material-ui/icons/ChevronLeft";
import Right from "@material-ui/icons/ChevronRight";

interface Props {
  direction?: "left" | "right";
}

const Chevron = ({ direction = "right", ...props }: Props, ref: React.Ref<any>) => {
  const Component = direction === "right" ? Right : Left;
  return <Component ref={ref} {...props} />;
};

export default React.memo(React.forwardRef(Chevron));
