import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import { Grid } from "/vendor/@material-ui/core";

import { Content } from "/lib/component/base";

import LoadingCard from "/lib/component/partial/LoadingCard";
import RelatedEntitiesCard from "/lib/component/partial/RelatedEntitiesCard";

import CheckResult from "./EventDetailsCheckSummary";
import CheckHistory from "./EventDetailsCheckHistory";
import Toolbar from "./EventDetailsToolbar";
import EntitySummary from "./EventDetailsEntitySummary";

class EventDetailsContainer extends React.Component {
  static propTypes = {
    event: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    refetch: PropTypes.func,
    toolbarItems: PropTypes.func,
    onCreateSilence: PropTypes.func.isRequired,
    onDeleteSilence: PropTypes.func.isRequired,
    onResolve: PropTypes.func.isRequired,
    onExecute: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    event: null,
    refetch: () => null,
    toolbarItems: undefined,
  };

  static fragments = {
    event: gql`
      fragment EventDetailsContainer_event on Event {
        id
        timestamp
        deleted @client
        ...EventDetailsToolbar_event
        ...EventDetailsCheckSummary_event

        check {
          ...EventDetailsCheckSummary_check
          ...EventDetailsCheckHistory_check
        }

        entity {
          ...EventDetailsCheckSummary_entity
          ...RelatedEntitiesCard_entity
          ...EventDetailsEntitySummary_entity
        }
      }

      ${CheckResult.fragments.event}
      ${CheckResult.fragments.check}
      ${CheckResult.fragments.entity}
      ${CheckHistory.fragments.check}
      ${RelatedEntitiesCard.fragments.entity}
      ${EntitySummary.fragments.entity}
      ${Toolbar.fragments.event}
    `,
  };

  render() {
    const {
      event,
      loading: loadingProp,
      refetch,
      toolbarItems,
      onCreateSilence,
      onDeleteSilence,
      onResolve,
      onExecute,
      onDelete,
    } = this.props;
    const loading = !event && loadingProp;

    return (
      <React.Fragment>
        <Content marginBottom>
          <Toolbar
            toolbarItems={toolbarItems}
            event={event}
            refetch={refetch}
            loading={loading}
            onCreateSilence={onCreateSilence}
            onDeleteSilence={onDeleteSilence}
            onResolve={onResolve}
            onExecute={onExecute}
            onDelete={onDelete}
          />
        </Content>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {loading ? <LoadingCard /> : <CheckHistory check={event.check} />}
          </Grid>
          <Grid item xs={12}>
            {loading ? <LoadingCard /> :
            <CheckResult
              event={event}
              check={event.check}
              entity={event.entity}
            />}
          </Grid>
          <Grid item xs={12} md={5}>
            {loading ? <LoadingCard /> : <RelatedEntitiesCard entity={event.entity} />}
          </Grid>
          <Grid item xs={12} md={7}>
            {loading ? <LoadingCard /> : <EntitySummary entity={event.entity} />}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default EventDetailsContainer;
