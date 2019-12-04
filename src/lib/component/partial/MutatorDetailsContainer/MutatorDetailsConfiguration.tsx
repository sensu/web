import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "/vendor/@material-ui/core";

import { Maybe } from "/lib/component/util";

import {
  CodeBlock,
  CodeHighlight,
  Duration,
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
} from "/lib/component/base";

import LabelsAnnotationsCell from "/lib/component/partial/LabelsAnnotationsCell";

interface MutatorDetailsConfigurationProps {
  mutator: {
    name: string;
    command: string;
    timeout: number;
    envVars: string[];
  };
}

const MutatorDetailsConfiguration = ({
  mutator,
}: MutatorDetailsConfigurationProps) => (
  <Card>
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Mutator Configuration
      </Typography>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
          <Dictionary>
            <DictionaryEntry>
              <DictionaryKey>Name</DictionaryKey>
              <DictionaryValue>{mutator.name}</DictionaryValue>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryKey>Timeout</DictionaryKey>
              <DictionaryValue>
                <Maybe value={mutator.timeout > 0} fallback="—">
                  {() =>
                    mutator.timeout ? (
                      <Duration duration={mutator.timeout * 1000} />
                    ) : (
                      "Never"
                    )
                  }
                </Maybe>
              </DictionaryValue>
            </DictionaryEntry>
          </Dictionary>
        </Grid>
      </Grid>
    </CardContent>
    <Divider />
    <CardContent>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Dictionary>
            <DictionaryEntry fullWidth={!!mutator.command}>
              <DictionaryKey>Command</DictionaryKey>
              <DictionaryValue>
                {mutator.command ? (
                  <CodeBlock>
                    <CodeHighlight language="bash" code={mutator.command} />
                  </CodeBlock>
                ) : (
                  "None"
                )}
              </DictionaryValue>
            </DictionaryEntry>
          </Dictionary>
        </Grid>
      </Grid>
    </CardContent>
    <Divider />
    <CardContent>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Dictionary>
            <DictionaryEntry fullWidth={mutator.envVars.length > 0}>
              <DictionaryKey>ENV Vars</DictionaryKey>
              <DictionaryValue>
                {mutator.envVars.length > 0 ? (
                  <CodeBlock>
                    <CodeHighlight
                      language="properties"
                      code={mutator.envVars.join("\n")}
                    />
                  </CodeBlock>
                ) : (
                  "None"
                )}
              </DictionaryValue>
            </DictionaryEntry>
          </Dictionary>
        </Grid>
      </Grid>
    </CardContent>
    <Divider />
    <CardContent>
      <LabelsAnnotationsCell resource={mutator} />
    </CardContent>
  </Card>
);

MutatorDetailsConfiguration.fragments = {
  mutator: gql`
    fragment MutatorDetailsConfiguration_mutator on Mutator {
      deleted @client
      id
      name
      command
      timeout
      envVars
      metadata {
        ...LabelsAnnotationsCell_objectmeta
      }
    }
    ${LabelsAnnotationsCell.fragments.objectmeta}
  `,
};

export default MutatorDetailsConfiguration;
