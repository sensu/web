/* eslint-disable react/prop-types */
import React from "react";
import classnames from "/vendor/classnames";
import { withStyles } from "/vendor/@material-ui/core";

import uniqueId from "/lib/util/uniqueId";

export const createStyledComponent = ({
  name,
  component: Component = "div",
  styles,
}) => {
  const path = `with-style-${uniqueId()}`;

  const enhancer = withStyles(theme => ({ [path]: styles(theme) }));

  const StyledComponent = ({
    className,
    classes: { [path]: newClass, ...classes },
    ...props
  }) => {
    const classesProps = {};
    if (classes.length > 0) {
      classesProps.classes = classes;
    }

    return (
      <Component
        className={classnames(className, newClass)}
        {...classesProps}
        {...props}
      />
    );
  };

  const result = enhancer(StyledComponent);

  if (name) {
    result.displayName = name;
  }

  return result;
};

export default createStyledComponent;
