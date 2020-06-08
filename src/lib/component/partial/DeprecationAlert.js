import React from "/vendor/react";
import BannerSink from "/lib/component/relocation/BannerSink";
import { RepoMoveBanner } from "/lib/component/banner";

export function DeprecationAlert() {
  const key = "deprecation-banner.isDismissed";
  const [isDismissed, setDismissed] = React.useState(!!localStorage.getItem(key));
  const dismiss = React.useCallback(() => {
    localStorage.setItem(key, "t");
    setDismissed("t");
  }, [setDismissed]);

  return (
    <React.Fragment>
      {!isDismissed && (
        <BannerSink>
          <RepoMoveBanner onClose={dismiss} />
        </BannerSink>
      )}
    </React.Fragment>
  );
}

export default DeprecationAlert;
