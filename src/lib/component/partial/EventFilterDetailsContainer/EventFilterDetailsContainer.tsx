import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { Grid } from "/vendor/@material-ui/core";
import { Content, Loader } from "/lib/component/base";

import Configuration from "./EventFilterDetailsConfiguration";
import EventFilterDetailsToolbar, {
  EventFilterDetailsToolbarProps,
} from "./EventFilterDetailsToolbar";

interface EventFilterDetailsContainerProps
  extends EventFilterDetailsToolbarProps {
  eventFilter: any;
  loading: boolean;
}

const EventFilterDetailsContainer = ({
  eventFilter,
  loading,
  toolbarItems,
}: EventFilterDetailsContainerProps) => (
  <Loader loading={loading} passthrough>
    {eventFilter && (
      <React.Fragment>
        <Content marginBottom>
          <EventFilterDetailsToolbar toolbarItems={toolbarItems} />
        </Content>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Configuration eventFilter={eventFilter} />
          </Grid>
        </Grid>
      </React.Fragment>
    )}
  </Loader>
);

export const eventFilterDetailsContainerFragments = {
  eventFilter: gql`
    fragment EventFilterDetailsContainer_eventFilter on EventFilter {
      id
      deleted @client

      ...EventFilterDetailsConfiguration_eventFilter
    }
    ${Configuration.fragments.eventFilter}
  `,
};

export default EventFilterDetailsContainer;
