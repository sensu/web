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

interface EventFilterDetailsConfigurationProps {
  eventFilter: {
    name: string;
    action: string;
    expressions: string[];
    runtimeAssets: string[];
  };
}

const EventFilterDetailsConfiguration = ({
  eventFilter,
}: EventFilterDetailsConfigurationProps) => (
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
              <DictionaryValue>{eventFilter.name}</DictionaryValue>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryKey>Action</DictionaryKey>
              <DictionaryValue>
                <EventFilterActionLabel action={eventFilter.action} />
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
            <DictionaryEntry fullWidth={!!eventFilter.expressions}>
              <DictionaryKey>Expressions</DictionaryKey>
              <DictionaryValue>
                {eventFilter.expressions &&
                eventFilter.expressions.length > 0 ? (
                  <CodeBlock>
                    <CodeHighlight
                      language="javascript"
                      code={eventFilter.expressions.join("\n")}
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
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Dictionary>
            <DictionaryEntry fullWidth={!!eventFilter.runtimeAssets}>
              <DictionaryKey>Runtime Assets</DictionaryKey>
              <DictionaryValue>
                {eventFilter.runtimeAssets &&
                eventFilter.runtimeAssets.length > 0 ? (
                  <CodeBlock>
                    <CodeHighlight
                      language="properties"
                      code={eventFilter.runtimeAssets.join("\n")}
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
    <LabelsAnnotationsCell resource={eventFilter} />
  </Card>
);

EventFilterDetailsConfiguration.fragments = {
  eventFilter: gql`
    fragment EventFilterDetailsConfiguration_eventFilter on EventFilter {
      deleted @client
      id
      name
      action
      expressions
      metadata {
        ...LabelsAnnotationsCell_objectmeta
      }
    }
    ${LabelsAnnotationsCell.fragments.objectmeta}
  `,
};

export default EventFilterDetailsConfiguration;
