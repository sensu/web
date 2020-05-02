import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Grid } from "/vendor/@material-ui/core";
import { Content } from "/lib/component/base";
import LoadingCard from "/lib/component/partial/LoadingCard";

import RelatedEntitiesCard from "/lib/component/partial/RelatedEntitiesCard";
import EntityDetailsEvents from "./EntityDetailsEvents";
import EntityDetailsInformation from "./EntityDetailsInformation";
import EntityDetailsProcesses from "./EntityDetailsProcesses";
import EntityDetailsToolbar from "./EntityDetailsToolbar";

class EntityDetailsContainer extends React.PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    refetch: PropTypes.func.isRequired,
    toolbarItems: PropTypes.func,
    onCreateSilence: PropTypes.func.isRequired,
    onDeleteSilence: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loading: false,
    toolbarItems: undefined,
  };

  static fragments = {
    entity: gql`
      fragment EntityDetailsContainer_entity on Entity {
        events(orderBy: LASTOK) {
          ...EntityDetailsEvents_event
        }

        system {
          processes {
            ...EntityDetailsProcesses_process
          }
        }

        ...RelatedEntitiesCard_entity
        ...EntityDetailsInformation_entity
        ...EntityDetailsToolbar_entity
      }

      ${RelatedEntitiesCard.fragments.entity}
      ${EntityDetailsEvents.fragments.event}
      ${EntityDetailsInformation.fragments.entity}
      ${EntityDetailsProcesses.fragments.process}
      ${EntityDetailsToolbar.fragments.entity}
    `,
  };

  render() {
    const {
      entity,
      loading: loadingProp,
      refetch,
      toolbarItems,
      onCreateSilence,
      onDeleteSilence,
      onDelete,
    } = this.props;
    const loading = !entity && loadingProp;

    return (
      <React.Fragment>
        <Content marginBottom>
          <EntityDetailsToolbar
            toolbarItems={toolbarItems}
            entity={entity}
            refetch={refetch}
            onCreateSilence={onCreateSilence}
            onDeleteSilence={onDeleteSilence}
            onDelete={onDelete}
          />
        </Content>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {loading ? (
              <LoadingCard />
            ) : (
              <EntityDetailsInformation entity={entity} />
            )}
          </Grid>
          <Grid item xs={12}>
            {!loading && entity.system.processes.length > 0 && (
              <EntityDetailsProcesses processes={entity.system.processes} />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <LoadingCard />
            ) : (
              <RelatedEntitiesCard entity={entity} />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {loading ? (
              <LoadingCard />
            ) : (
              <EntityDetailsEvents events={entity.events} />
            )}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default EntityDetailsContainer;
