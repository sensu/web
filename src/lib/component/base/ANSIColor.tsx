/* eslint-disable react/prop-types */

import React from "/vendor/react";
import Skeleton from "./Skeleton";
import { ANSIColorLazyProps } from "./ANSIColorLazy";

export type ANSIColorProps = ANSIColorLazyProps;

const Component = React.lazy(() => import("./ANSIColorLazy"));

const ANSIColor: React.FC<ANSIColorProps> = ({ ref, ...props }) => {
  return (
    <React.Suspense fallback={<Skeleton variant="text">loading</Skeleton>}>
      <Component {...props} />
    </React.Suspense>
  );
};

export default ANSIColor;
