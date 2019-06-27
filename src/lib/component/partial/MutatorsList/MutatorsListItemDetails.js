import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Code, CodeHighlight } from "/lib/component/base";
import { Maybe, NamespaceLink } from "/lib/component/util";

const MutatorsListItemDetails = ({ mutator }) => (
  <React.Fragment>
    <div>
      {`Type: `}
      <strong>{mutator.id}</strong>
    </div>

    <Maybe value={mutator.id}>
      {() => <React.Fragment>{`Command: `}</React.Fragment>}
    </Maybe>
  </React.Fragment>
);

MutatorsListItemDetails.propTypes = {
  mutator: PropTypes.object.isRequired,
};

MutatorsListItemDetails.fragments = {
  mutator: gql`
    fragment MuatorssListItemDetails_mutator on Mutator {
      id
      name
      namespace
    }
  `,
};

export default MutatorsListItemDetails;
