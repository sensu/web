import React from "/vendor/react";
import Left from "@material-ui/icons/ChevronLeft";
import Right from "@material-ui/icons/ChevronRight";

interface Props {
  direction?: "left" | "right";
}

const Chevron = ({ direction = "right", ...props }: Props) => {
  if (direction === "right") {
    return <Right {...props} />;
  }
  return <Left {...props} />;
};

export default Chevron;
