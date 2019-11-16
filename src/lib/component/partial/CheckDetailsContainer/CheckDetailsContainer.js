import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Content } from "/lib/component/base";
import { Grid } from "/vendor/@material-ui/core";
import LoadingCard from "/lib/component/partial/LoadingCard";

import Configuration from "./CheckDetailsConfiguration";
import Toolbar from "./CheckDetailsToolbar";

class CheckDetailsContainer extends React.PureComponent {
  static propTypes = {
    check: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    refetch: PropTypes.func,
    toolbarItems: PropTypes.func,
    onCreateSilence: PropTypes.func.isRequired,
    onDeleteSilence: PropTypes.func.isRequired,
    onExecute: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
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
    const {
      check,
      loading: loadingProp,
      refetch,
      toolbarItems,
      onCreateSilence,
      onDeleteSilence,
      onExecute,
      onPublish,
    } = this.props;
    const loading = !check && loadingProp;

    return (
      <React.Fragment>
        <Content marginBottom>
          <Toolbar
            toolbarItems={toolbarItems}
            check={check}
            refetch={refetch}
            onCreateSilence={onCreateSilence}
            onDeleteSilence={onDeleteSilence}
            onExecute={onExecute}
            onPublish={onPublish}
          />
        </Content>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {loading ? <LoadingCard /> : <Configuration check={check} />}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default CheckDetailsContainer;
