import React from "/vendor/react";
import PropTypes from "prop-types";
import { Button, Link } from "/vendor/@material-ui/core";

import { Banner } from "/lib/component/base";

class RepoMoveBanner extends React.PureComponent {
  static propTypes = {
    client: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Banner
        message="There's important changes coming to the Sensu Go OSS web UI."
        variant="info"
        actions={
          <Link
            style={{ color: "inherit" }}
            component={Button}
            href=""
          >
            Learn More
          </Link>
        }
      />
    );
  }
}

export default RepoMoveBanner;
