import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Card, CardContent, Typography, List } from "/vendor/@material-ui/core";

import {
  CheckStatusIcon,
  InlineLink,
  DetailedListItem,
  DetailedListItemTitle,
  DetailedListItemSubtitle,
} from "/lib/component/base";

import EntityStatusDescriptor from "/lib/component/partial/EntityStatusDescriptor";

class RelatedEntitiesCard extends React.Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  static fragments = {
    entity: gql`
      fragment RelatedEntitiesCard_entity on Entity {
        related(limit: 5) {
          id
          namespace
          name
          status

          ...EntityStatusDescriptor_entity
        }
      }

      ${EntityStatusDescriptor.fragments.entity}
    `,
  };

  renderItem = entityProp => {
    const { namespace, ...entity } = entityProp;

    return (
      <DetailedListItem key={entity.id}>
        <DetailedListItemTitle inset>
          <Typography
            component="span"
            style={{ position: "absolute", left: 0 }}
          >
            <CheckStatusIcon statusCode={entity.status} inline mutedOK small />
          </Typography>
          <InlineLink to={`/${namespace}/entities/${entity.name}`}>
            {entity.name}
          </InlineLink>
        </DetailedListItemTitle>
        <DetailedListItemSubtitle inset>
          <EntityStatusDescriptor entity={entity} />
        </DetailedListItemSubtitle>
      </DetailedListItem>
    );
  };

  renderItems = () => {
    const { entity } = this.props;

    if (entity.related.length === 0) {
      return <Typography>None found.</Typography>;
    }
    return entity.related.map(this.renderItem);
  };

  render() {
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" paragraph>
            Related Entities
          </Typography>
          <List disablePadding>{this.renderItems()}</List>
        </CardContent>
      </Card>
    );
  }
}

export default RelatedEntitiesCard;
