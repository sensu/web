import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  withStyles,
  Card,
  CardContent,
  Divider,
  Typography,
  Tooltip,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "/vendor/@material-ui/core";

import {
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
  InlineLink,
  CheckStatusIcon,
  RelativeToCurrentDate,
} from "/lib/component/base";
import { Maybe, NamespaceLink } from "/lib/component/util";
import { SilenceIcon, ExpandMoreIcon } from "/lib/component/icon";
import { statusCodeToId } from "/lib/util/checkStatus";

const Strong = withStyles(() => ({
  root: {
    color: "inherit",
    fontSize: "inherit",
    fontWeight: 500,
  },
}))(Typography);

const styles = theme => ({
  smaller: { width: "20%" },
  fullWidth: {
    width: "100%",
  },
  expand: { color: theme.palette.text.secondary },
});

class EventDetailsEntitySummary extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
  };

  static fragments = {
    entity: gql`
      fragment EventDetailsEntitySummary_entity on Entity {
        name
        entityClass
        subscriptions
        lastSeen
        status
        silences {
          name
        }
        user
        redact
        deregister
        deregistration {
          handler
        }
        system {
          arch
          os
          hostname
          platform
          platformFamily
          platformVersion
          network {
            interfaces {
              name
              addresses
              mac
            }
          }
        }
      }
    `,
  };

  render() {
    const {
      entity: entityProp,
      entity: { system },
      classes,
    } = this.props;
    const { namespace, ...entity } = entityProp;
    const statusCode = entity.status;
    const status = statusCodeToId(statusCode);

    return (
      <Card>
        <CardContent>
          <Typography variant="h5" paragraph>
            Entity Summary
            {entity.silences.length > 0 && (
              <Tooltip title="Silenced">
                <SilenceIcon style={{ float: "right" }} />
              </Tooltip>
            )}
          </Typography>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={12}>
              <Dictionary>
                <DictionaryEntry>
                  <DictionaryKey className={classes.smaller}>
                    Entity
                  </DictionaryKey>
                  <DictionaryValue className={classes.fullWidth}>
                    <NamespaceLink
                      namespace={namespace}
                      component={InlineLink}
                      to={`/entities/${entity.name}`}
                    >
                      {entity.name}
                    </NamespaceLink>
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey className={classes.smaller}>
                    Status
                  </DictionaryKey>
                  <DictionaryValue className={classes.fullWidth}>
                    <CheckStatusIcon inline small statusCode={statusCode} />{" "}
                    {`${status} `}({statusCode})
                  </DictionaryValue>
                </DictionaryEntry>
                {entity.silences.length > 0 && (
                  <DictionaryEntry>
                    <DictionaryKey className={classes.smaller}>
                      Silenced By
                    </DictionaryKey>
                    <DictionaryValue className={classes.fullWidth}>
                      {entity.silences.map(s => s.name).join(", ")}
                    </DictionaryValue>
                  </DictionaryEntry>
                )}
                <DictionaryEntry>
                  <DictionaryKey className={classes.smaller}>
                    Last Seen
                  </DictionaryKey>
                  <DictionaryValue className={classes.fullWidth}>
                    <Maybe value={entity.lastSeen} fallback="n/a">
                      {val => <RelativeToCurrentDate dateTime={val} />}
                    </Maybe>
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey className={classes.smaller}>
                    Subscriptions
                  </DictionaryKey>
                  <DictionaryValue className={classes.fullWidth}>
                    {entity.subscriptions.length > 0
                      ? entity.subscriptions.join(", ")
                      : "—"}
                  </DictionaryValue>
                </DictionaryEntry>
              </Dictionary>
            </Grid>
          </Grid>
        </CardContent>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="button" className={classes.expand}>
              More
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6}>
                <Dictionary>
                  <DictionaryEntry>
                    <DictionaryKey>Class</DictionaryKey>
                    <DictionaryValue>{entity.entityClass}</DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Hostname</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={system.hostname} fallback="n/a" />
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>User</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={entity.user} fallback="—" />
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Deregister</DictionaryKey>
                    <DictionaryValue>
                      {entity.deregister ? "yes" : "no"}
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Deregistration Handler</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={system.deregistration} fallback="—">
                        {config => config.handler}
                      </Maybe>
                    </DictionaryValue>
                  </DictionaryEntry>
                </Dictionary>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Dictionary>
                  <DictionaryEntry>
                    <DictionaryKey>OS</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={system.os} fallback="n/a" />
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Platform</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={system.platform} fallback="n/a">
                        {() =>
                          [
                            `${system.platform} ${system.platformVersion}`,
                            system.platformFamily,
                          ]
                            .reduce(
                              (memo, val) => (val ? [...memo, val] : memo),
                              [],
                            )
                            .join(" / ")
                        }
                      </Maybe>
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Architecture</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={system.arch} fallback="n/a" />
                    </DictionaryValue>
                  </DictionaryEntry>
                </Dictionary>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
          <Divider />
          {system.network.interfaces.map(
            intr =>
              // Only display network interfaces that have a MAC address at
              // this time. This avoids displaying the loopback and tunnel
              // interfaces.
              intr.mac &&
              intr.addresses.length > 0 && (
                <ExpansionPanelDetails key={intr.name}>
                  <Grid item xs={12} sm={6}>
                    <Dictionary>
                      <DictionaryEntry>
                        <DictionaryKey>Adapter</DictionaryKey>
                        <DictionaryValue>
                          <Strong>{intr.name}</Strong>
                        </DictionaryValue>
                      </DictionaryEntry>
                      <DictionaryEntry>
                        <DictionaryKey>MAC</DictionaryKey>
                        <DictionaryValue>
                          <Maybe value={intr.mac} fallback="n/a" />
                        </DictionaryValue>
                      </DictionaryEntry>
                      {intr.addresses.map((address, i) => (
                        <DictionaryEntry key={address}>
                          <DictionaryKey>
                            {i === 0 ? "IP Address" : <span>&nbsp;</span>}
                          </DictionaryKey>
                          <DictionaryValue>{address}</DictionaryValue>
                        </DictionaryEntry>
                      ))}
                    </Dictionary>
                  </Grid>
                </ExpansionPanelDetails>
              ),
          )}

          <Divider />
          <ExpansionPanelDetails>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12}>
                <Dictionary>
                  <DictionaryEntry>
                    <DictionaryKey className={classes.smaller}>
                      Redacted Keys
                    </DictionaryKey>
                    <DictionaryValue className={classes.fullWidth}>
                      {entity.redact.length > 0
                        ? entity.redact.join(", ")
                        : "—"}
                    </DictionaryValue>
                  </DictionaryEntry>
                </Dictionary>
              </Grid>
            </Grid>
            <Divider />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Card>
    );
  }
}

export default withStyles(styles)(EventDetailsEntitySummary);
