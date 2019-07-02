import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { NamespaceLink } from "/lib/component/util";
import { TableRow } from "/vendor/@material-ui/core";

import ResourceDetails from "/lib/component/partial/ResourceDetails";
import TableOverflowCell from "/lib/component/partial/TableOverflowCell";

import MutatorsListItemDetails from "./MutatorsListItemDetails";

const MutatorsListItem = ({ mutator }) => (
  <TableRow>
    <TableOverflowCell>
      <ResourceDetails
        title={
          <NamespaceLink
            namespace={mutator.namespace}
            to={`/mutators/${mutator.name}`}
          >
            <strong>{mutator.name} </strong>
          </NamespaceLink>
        }
        details={<MutatorsListItemDetails mutator={mutator} />}
      />
    </TableOverflowCell>
  </TableRow>
);

MutatorsListItem.propTypes = {
  mutator: PropTypes.object.isRequired,
};

MutatorsListItem.fragments = {
  mutator: gql`
    fragment MutatorsListItem_mutator on Mutator {
      name
      namespace

      ...MutatorsListItemDetails_mutator
    }

    ${MutatorsListItemDetails.fragments.mutator}
  `,
};

export default MutatorsListItem;
