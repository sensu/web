import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "/vendor/@material-ui/core";

import { Maybe, NamespaceLink } from "/lib/component/util";

import {
  Code,
  CodeBlock,
  CodeHighlight,
  Duration,
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
} from "/lib/component/base";

import LabelsAnnotationsCell from "/lib/component/partial/LabelsAnnotationsCell";

const HandlerDetailsConfiguration = ({ handler }) => (
  <Card>
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Handler Configuration
      </Typography>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
          <Dictionary>
            <DictionaryEntry>
              <DictionaryKey>Name</DictionaryKey>
              <DictionaryValue>{handler.name}</DictionaryValue>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryKey>Type</DictionaryKey>
              <DictionaryValue>{handler.type}</DictionaryValue>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryKey>Filters</DictionaryKey>
              <DictionaryValue>
                <Maybe value={handler.filters.length > 0} fallback="—">
                  {() => (
                    <React.Fragment>
                      {handler.filters.map(filter => (
                        <div key={filter}>
                          <CodeHighlight
                            key={filter}
                            language="json"
                            code={`${filter}`}
                            component={Code}
                          />
                        </div>
                      ))}
                    </React.Fragment>
                  )}
                </Maybe>
              </DictionaryValue>
            </DictionaryEntry>
          </Dictionary>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Dictionary>
            <DictionaryEntry>
              <DictionaryKey>Socket</DictionaryKey>
              <DictionaryValue>
                <Maybe
                  value={handler.type === "tcp" || handler.type === "udp"}
                  fallback="—"
                >
                  {() => (
                    <CodeHighlight
                      language="json"
                      code={`${handler.type}://${handler.socket.host}:${
                        handler.socket.port
                      }`}
                      component={Code}
                    />
                  )}
                </Maybe>
              </DictionaryValue>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryKey>Timeout</DictionaryKey>
              <DictionaryValue>
                <Maybe value={handler.timeout > 0} fallback="—">
                  {val => (val ? <Duration duration={val * 1000} /> : "Never")}
                </Maybe>
              </DictionaryValue>
            </DictionaryEntry>
            <DictionaryEntry>
              <DictionaryKey>Handlers</DictionaryKey>
              <DictionaryValue>
                <Maybe value={handler.type === "set"} fallback="—">
                  {() => (
                    <React.Fragment>
                      {handler.handlers.map(hd => (
                        <div key={hd.name}>
                          <NamespaceLink
                            namespace={hd.namespace}
                            to={`/handlers/${hd.name}`}
                          >
                            <CodeHighlight
                              language="json"
                              code={`${hd.name}`}
                              component={Code}
                            />
                          </NamespaceLink>
                        </div>
                      ))}
                    </React.Fragment>
                  )}
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
            <DictionaryEntry fullWidth={!!handler.command}>
              <DictionaryKey>Command</DictionaryKey>
              <DictionaryValue>
                {handler.command ? (
                  <CodeBlock>
                    <CodeHighlight
                      language="bash"
                      code={handler.command}
                      component={Code}
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
            <DictionaryEntry fullWidth={handler.envVars.length > 0}>
              <DictionaryKey>ENV Vars</DictionaryKey>
              <DictionaryValue>
                {handler.envVars.length > 0 ? (
                  <CodeBlock>
                    <CodeHighlight
                      language="properties"
                      code={handler.envVars.join("\n")}
                      component={Code}
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
    <LabelsAnnotationsCell handler={handler} />
  </Card>
);

HandlerDetailsConfiguration.propTypes = {
  handler: PropTypes.object,
};

HandlerDetailsConfiguration.defaultProps = {
  handler: null,
};

HandlerDetailsConfiguration.fragments = {
  handler: gql`
    fragment HandlerDetailsConfiguration_handler on Handler {
      name
      type
      command
      timeout
      handlers {
        name
      }
      socket {
        port
        host
      }
      filters
      envVars
      metadata {
        ...LabelsAnnotationsCell_objectmeta
      }
    }
    ${LabelsAnnotationsCell.fragments.objectmeta}
  `,
};

export default HandlerDetailsConfiguration;
