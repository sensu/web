import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { NamespaceLink } from "/lib/component/util";
import { TableRow } from "/vendor/@material-ui/core";

import ResourceDetails from "/lib/component/partial/ResourceDetails";
import TableOverflowCell from "/lib/component/partial/TableOverflowCell";

import HandlersListItemDetails from "./HandlersListItemDetails";

const HandlersListItem = ({ handler }) => (
  <TableRow>
    <TableOverflowCell>
      <ResourceDetails
        title={
          <NamespaceLink
            namespace={handler.namespace}
            to={`/handers/${handler.name}`}
          >
            <strong>{handler.name} </strong>
          </NamespaceLink>
        }
        details={<HandlersListItemDetails handler={handler} />}
      />
    </TableOverflowCell>
  </TableRow>
);

HandlersListItem.propTypes = {
  handler: PropTypes.object.isRequired,
};

HandlersListItem.fragments = {
  handler: gql`
    fragment HandlersListItem_handler on Handler {
      id
      name
      namespace
      command

      ...HandlersListItemDetails_handler
    }

    ${HandlersListItemDetails.fragments.handler}
  `,
};

export default HandlersListItem;
