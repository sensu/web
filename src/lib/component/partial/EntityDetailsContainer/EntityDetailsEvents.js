import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";

import {
  DetailedListItem,
  DetailedListItemTitle,
  DetailedListItemSubtitle,
  InlineLink,
  CheckStatusIcon,
} from "/lib/component/base";

import EventStatusDescriptor from "/lib/component/partial/EventStatusDescriptor";

class EntityDetailsEvents extends React.PureComponent {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static fragments = {
    event: gql`
      fragment EntityDetailsEvents_event on Event {
        namespace
        check {
          name
          status
          ...EventStatusDescriptor_check
        }
        entity {
          name
        }

        id
        timestamp
        isSilenced
        ...EventStatusDescriptor_event
      }

      ${EventStatusDescriptor.fragments.check}
      ${EventStatusDescriptor.fragments.event}
    `,
  };

  _renderItem = eventProp => {
    const { check, entity, namespace, ...event } = eventProp;

    if (check === null) {
      return null;
    }

    return (
      <DetailedListItem key={event.id}>
        <DetailedListItemTitle inset>
          <Typography
            component="span"
            style={{ position: "absolute", left: 0 }}
          >
            <CheckStatusIcon
              statusCode={check.status}
              silenced={event.isSilenced}
              inline
              mutedOK
              small
            />
          </Typography>
          <InlineLink to={`/${namespace}/events/${entity.name}/${check.name}`}>
            {check.name}
          </InlineLink>
        </DetailedListItemTitle>
        <DetailedListItemSubtitle inset>
          <EventStatusDescriptor compact event={event} check={check} />
        </DetailedListItemSubtitle>
      </DetailedListItem>
    );
  };

  _renderItems = () => {
    const { events } = this.props;

    if (events.length === 0) {
      return <Typography>No events found.</Typography>;
    }
    return events.map(this._renderItem);
  };

  render() {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" paragraph>
            Events
          </Typography>
          <List disablePadding>{this._renderItems()}</List>
        </CardContent>
      </Card>
    );
  }
}

export default EntityDetailsEvents;
