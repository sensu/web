import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "/vendor/@material-ui/core";

import {
  CodeBlock,
  CodeHighlight,
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
} from "/lib/component/base";

import EventFilterActionLabel from "/lib/component/partial/EventFilterActionLabel";
import LabelsAnnotationsCell from "/lib/component/partial/LabelsAnnotationsCell";
import RuntimeAssetsCell, {
  RuntimeAsset,
} from "/lib/component/partial/RuntimeAssetsCell";

interface EventFilterDetailsConfigurationProps {
  eventFilter: {
    name: string;
    action: string;
    expressions: string[];
    runtimeAssets: RuntimeAsset[];
  };
}

const EventFilterDetailsConfiguration = ({
  eventFilter,
}: EventFilterDetailsConfigurationProps) => {
  const { name, action, expressions, runtimeAssets } = eventFilter;
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Filter Configuration
        </Typography>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
            <Dictionary>
              <DictionaryEntry>
                <DictionaryKey>Name</DictionaryKey>
                <DictionaryValue>{name}</DictionaryValue>
              </DictionaryEntry>
              <DictionaryEntry>
                <DictionaryKey>Action</DictionaryKey>
                <DictionaryValue>
                  <EventFilterActionLabel action={action} />
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
              <DictionaryEntry fullWidth={!!expressions}>
                <DictionaryKey>Expressions</DictionaryKey>
                <DictionaryValue>
                  {expressions && expressions.length > 0 ? (
                    <CodeBlock>
                      <CodeHighlight
                        language="javascript"
                        code={expressions.join("\n")}
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
      <RuntimeAssetsCell runtimeAssets={runtimeAssets} />
      <Divider />
      <CardContent>
        <LabelsAnnotationsCell resource={eventFilter} />
      </CardContent>
    </Card>
  );
};

EventFilterDetailsConfiguration.fragments = {
  eventFilter: gql`
    fragment EventFilterDetailsConfiguration_eventFilter on EventFilter {
      deleted @client
      id
      name
      action
      expressions
      runtimeAssets {
        ...RuntimeAssetsCell_assets
      }
      metadata {
        ...LabelsAnnotationsCell_objectmeta
      }
    }
    ${LabelsAnnotationsCell.fragments.objectmeta}
    ${RuntimeAssetsCell.fragments.assets}
  `,
};

export default EventFilterDetailsConfiguration;
