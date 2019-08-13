import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Grid } from "/vendor/@material-ui/core";

import { Content, Loader } from "/lib/component/base";

import Configuration from "./CheckDetailsConfiguration";
import Toolbar from "./CheckDetailsToolbar";

class CheckDetailsContainer extends React.PureComponent {
  static propTypes = {
    check: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    refetch: PropTypes.func,
    toolbarItems: PropTypes.func,
  };

  static defaultProps = {
    check: null,
    refetch: () => null,
    toolbarItems: undefined,
  };

  static fragments = {
    check: gql`
      fragment CheckDetailsContainer_check on CheckConfig {
        id
        deleted @client

        ...CheckDetailsToolbar_check
        ...CheckDetailsConfiguration_check
      }

      ${Toolbar.fragments.check}
      ${Configuration.fragments.check}
    `,
  };

  render() {
    const { check, loading, refetch, toolbarItems } = this.props;

    return (
      <Loader loading={loading} passthrough>
        {check && (
          <React.Fragment>
            <Content marginBottom>
              <Toolbar
                toolbarItems={toolbarItems}
                check={check}
                refetch={refetch}
              />
            </Content>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Configuration check={check} />
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </Loader>
    );
  }
}

export default CheckDetailsContainer;
