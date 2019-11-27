import React from "/vendor/react";

import { Sink } from "/lib/component/relocation/Relocation";
import { BANNER } from "/lib/component/relocation/types";

interface Props {
  children: React.ReactElement;
}

const BannerSink = React.memo(({ children }: Props) => {
  const props = {
    children: {
      render: () => children,
      type: BANNER,
    },
  };
  return <Sink {...props} />;
});
BannerSink.displayName = "BannerSink";

export default BannerSink;
