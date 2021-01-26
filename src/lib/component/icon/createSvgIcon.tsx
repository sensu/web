import * as React from 'react';
import { SvgIcon } from "/vendor/@material-ui/core";

const createSvgIcon = (path: React.ReactElement, displayName: string) => {
  const Component = (props: Record<string, any>, ref: React.Ref<any>) => (
    <SvgIcon data-testid={`${displayName}Icon`} ref={ref} {...props}>
      {path}
    </SvgIcon>
  );

  Component.displayName = `${displayName}Icon`;
  return React.memo(React.forwardRef(Component));
}

export default createSvgIcon;
