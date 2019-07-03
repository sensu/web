import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Code, CodeHighlight } from "/lib/component/base";
import { Maybe } from "/lib/component/util";

const MutatorsListItemDetails = ({ mutator }) => (
  <React.Fragment>
    <Maybe value={mutator.id}>
      {() => (
        <React.Fragment>
          {`Command: `}
          <CodeHighlight
            language="bash"
            code={mutator.command}
            component={Code}
          />
        </React.Fragment>
      )}
    </Maybe>
  </React.Fragment>
);

MutatorsListItemDetails.propTypes = {
  mutator: PropTypes.object.isRequired,
};

MutatorsListItemDetails.fragments = {
  mutator: gql`
    fragment MutatorsListItemDetails_mutator on Mutator {
      name
      command
    }
  `,
};

export default MutatorsListItemDetails;
