import * as React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { Grid } from "/vendor/@material-ui/core";
import { Content, Loader } from "/lib/component/base";

import Configuration from "./MutatorDetailsConfiguration";
import MutatorDetailsToolbar, {
  MutatorDetailsToolbarProps,
} from "./MutatorDetailsToolbar";

interface MutatorDetailsContainerProps extends MutatorDetailsToolbarProps {
  mutator: any;
  loading: boolean;
}

const MutatorDetailsContainer = ({
  mutator,
  loading,
  toolbarItems,
}: MutatorDetailsContainerProps) => (
  <Loader loading={loading} passthrough>
    {mutator && (
      <React.Fragment>
        <Content marginBottom>
          <MutatorDetailsToolbar toolbarItems={toolbarItems} />
        </Content>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Configuration mutator={mutator} />
          </Grid>
        </Grid>
      </React.Fragment>
    )}
  </Loader>
);

export const mutatorDetailsContainerFragments = {
  mutator: gql`
    fragment MutatorDetailsContainer_mutator on Mutator {
      id
      deleted @client

      ...MutatorDetailsConfiguration_mutator
    }
    ${Configuration.fragments.mutator}
  `,
};

export default MutatorDetailsContainer;
