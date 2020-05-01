import React from "/vendor/react";
import PropTypes from "prop-types";

import { Box } from "/vendor/@material-ui/core";
import { NotFound, AppLayout } from "/lib/component/partial";

class NamespaceNotFoundView extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  render() {
    const { namespace } = this.props.match.params;

    return (
      <AppLayout disableBreadcrumbs>
        <Box height="calc(100vh - 24px)" display="flex" alignItems="center">
          <NotFound>
            The namespace <strong>{namespace}</strong> could not be loaded.
          </NotFound>
        </Box>
      </AppLayout>
    );
  }
}

export default NamespaceNotFoundView;
