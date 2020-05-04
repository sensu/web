import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";
import {
  withStyles,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Tooltip,
  List,
} from "/vendor/@material-ui/core";

import { statusCodeToId } from "/lib/util/checkStatus";

import {
  CardHighlight,
  DateTime,
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
  DetailedListItem,
  DetailedListItemTitle,
  RelativeToCurrentDate,
  CheckStatusIcon,
} from "/lib/component/base";
import { Maybe } from "/lib/component/util";
import { SilenceIcon } from "/lib/component/icon";

import LabelsAnnotationsCell from "/lib/component/partial/LabelsAnnotationsCell";

const Strong = withStyles(() => ({
  root: {
    color: "inherit",
    fontSize: "inherit",
    fontWeight: 600,
  },
}))(Typography);

class EntityDetailsInformation extends React.PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  static fragments = {
    entity: gql`
      fragment EntityDetailsInformation_entity on Entity {
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
          ARMVersion
          libCType
          VMSystem
          VMRole
          cloudProvider
          floatType

          network {
            interfaces {
              name
              addresses
              mac
            }
          }
        }

        metadata {
          ...LabelsAnnotationsCell_objectmeta
        }
      }
      ${LabelsAnnotationsCell.fragments.objectmeta}
    `,
  };

  render() {
    const {
      entity,
      entity: { system },
    } = this.props;
    const statusCode = entity.status;
    const status = statusCodeToId(statusCode);

    // Only display network interfaces that have a MAC address at
    // this time. This avoids displaying the loopback and tunnel
    // interfaces.
    const networkInterfaces = system.network.interfaces.filter(
      intr => intr.mac && intr.addresses.length > 0,
    );

    return (
      <Card>
        <CardHighlight color={status} />
        <CardContent>
          <Typography variant="h5" paragraph>
            Entity: {entity.name}
            {entity.silences.length > 0 && (
              <Tooltip title="Silenced">
                <SilenceIcon style={{ float: "right" }} />
              </Tooltip>
            )}
          </Typography>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={6}>
              <Dictionary>
                <DictionaryEntry>
                  <DictionaryKey>Status</DictionaryKey>
                  <DictionaryValue>
                    <CheckStatusIcon inline small statusCode={statusCode} />{" "}
                    {`${status} `}({statusCode})
                  </DictionaryValue>
                </DictionaryEntry>
                {entity.silences.length > 0 && (
                  <DictionaryEntry>
                    <DictionaryKey>Silenced By</DictionaryKey>
                    <DictionaryValue>
                      {entity.silences.map(s => s.name).join(", ")}
                    </DictionaryValue>
                  </DictionaryEntry>
                )}
                <DictionaryEntry>
                  <DictionaryKey>Last Seen</DictionaryKey>
                  <DictionaryValue>
                    <Maybe value={entity.lastSeen} fallback="n/a">
                      {val => <RelativeToCurrentDate dateTime={val} />}
                    </Maybe>
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>Subscriptions</DictionaryKey>
                  <DictionaryValue>
                    {entity.subscriptions.length > 0 ? (
                      <List disablePadding>
                        {entity.subscriptions.map(subscription => (
                          <DetailedListItem key={subscription}>
                            <DetailedListItemTitle>
                              {subscription}
                            </DetailedListItemTitle>
                          </DetailedListItem>
                        ))}
                      </List>
                    ) : (
                      "—"
                    )}
                  </DictionaryValue>
                </DictionaryEntry>
              </Dictionary>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Dictionary>
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
                <DictionaryEntry>
                  <DictionaryKey>Redacted Keys</DictionaryKey>
                  <DictionaryValue>
                    {entity.redact.length > 0 ? entity.redact.join(", ") : "—"}
                  </DictionaryValue>
                </DictionaryEntry>
              </Dictionary>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardContent>
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
                  <DictionaryKey>Cloud Provider</DictionaryKey>
                  <DictionaryValue>
                    <Maybe value={system.cloudProvider} fallback="—" />
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>VM System</DictionaryKey>
                  <DictionaryValue>
                    <Maybe value={system.VMSystem} fallback="—" />
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>VM Role</DictionaryKey>
                  <DictionaryValue>
                    <Maybe value={system.VMRole} fallback="—" />
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
                <DictionaryEntry>
                  <DictionaryKey>ARM Version</DictionaryKey>
                  <DictionaryValue>
                    <Maybe value={system.ARMVersion} fallback="n/a" />
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>Float Type</DictionaryKey>
                  <DictionaryValue>
                    <Maybe value={system.ARMVersion} fallback="—" />
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>libc Implementation</DictionaryKey>
                  <DictionaryValue>
                    <Maybe value={system.libcType} fallback="—" />
                  </DictionaryValue>
                </DictionaryEntry>
              </Dictionary>
            </Grid>
          </Grid>
        </CardContent>
        <Maybe value={networkInterfaces}>
          <Divider />
          <CardContent>
            <Grid container spacing={0}>
              {networkInterfaces.map(intr => (
                <Grid item xs={12} sm={6} key={intr.name}>
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
              ))}
            </Grid>
          </CardContent>
        </Maybe>
        <Divider />
        <CardContent>
          <LabelsAnnotationsCell resource={entity} />
        </CardContent>
      </Card>
    );
  }
}

export default EntityDetailsInformation;
