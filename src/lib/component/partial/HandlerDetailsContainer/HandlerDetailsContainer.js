import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Grid } from "/vendor/@material-ui/core";

import { Content, Loader } from "/lib/component/base";

import Configuration from "./HandlerDetailsConfiguration";
import Toolbar from "./HandlerDetailsToolbar";

const HandlerDetailsContainer = ({ handler, loading, toolbarItems }) => (
  <Loader loading={loading} passthrough>
    {handler && (
      <React.Fragment>
        <Content marginBottom>
          <Toolbar toolbarItems={toolbarItems} />
        </Content>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Configuration handler={handler} />
          </Grid>
        </Grid>
      </React.Fragment>
    )}
  </Loader>
);

HandlerDetailsContainer.propTypes = {
  handler: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  toolbarItems: PropTypes.func,
};

HandlerDetailsContainer.defaultProps = {
  handler: null,
  toolbarItems: undefined,
};

HandlerDetailsContainer.fragments = {
  handler: gql`
    fragment HandlerDetailsContainer_handler on Handler {
      id
      deleted @client

      ...HandlerDetailsConfiguration_handler
    }
    ${Configuration.fragments.handler}
  `,
};

export default HandlerDetailsContainer;
