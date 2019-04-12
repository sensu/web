import React from "/vendor/react";
import PropTypes from "prop-types";

import { NotFound, AppLayout } from "/lib/component/partial";

class NamespaceNotFoundView extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  render() {
    const { namespace } = this.props.match.params;

    return (
      <AppLayout namespace={namespace}>
        <NotFound>
          The namespace <strong>{namespace}</strong> could not be loaded.
        </NotFound>
      </AppLayout>
    );
  }
}

export default NamespaceNotFoundView;
