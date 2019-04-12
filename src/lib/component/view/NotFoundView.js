import React from "/vendor/react";

import { AppLayout } from "/lib/component/base";

import { NotFound } from "/lib/component/partial";

class NotFoundView extends React.PureComponent {
  render() {
    return <AppLayout content={<NotFound />} />;
  }
}

export default NotFoundView;
