import React from "/vendor/react";
import PropTypes from "prop-types";
import { Button, Link } from "/vendor/@material-ui/core";

import { Banner } from "/lib/component/base";

class RepoMoveBanner extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Banner
        onClose={this.props.onClose}
        message="There's important changes coming to the Sensu Go OSS web UI."
        variant="info"
        actions={
          <Link
            style={{ color: "inherit" }}
            component={Button}
            href="https://discourse.sensu.io/t/building-a-better-ui-for-sensu/1859"
          >
            Learn More
          </Link>
        }
      />
    );
  }
}

export default RepoMoveBanner;
