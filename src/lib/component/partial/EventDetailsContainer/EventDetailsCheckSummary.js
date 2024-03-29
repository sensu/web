/* eslint-disable react/prop-types */

import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import {
  withStyles,
  Card,
  CardContent,
  Divider,
  Typography,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Tooltip,
  List,
} from "/vendor/@material-ui/core";

import { statusCodeToId } from "/lib/util/checkStatus";
import {
  ANSIColor,
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
  CardHighlight,
  RelativeToCurrentDate,
  DateStringFormatter,
  DateTime,
  KitchenTime,
  Duration,
  CheckStatusIcon,
  InlineLink,
  CodeBlock,
  Code,
  CodeHighlight,
  DetailedListItem,
  DetailedListItemTitle,
} from "/lib/component/base";
import { Maybe, NamespaceLink } from "/lib/component/util";
import { SilenceIcon, ExpandMoreIcon } from "/lib/component/icon";

import LabelsAnnotationsCell from "/lib/component/partial/LabelsAnnotationsCell";
import CronDescriptor from "/lib/component/partial/CronDescriptor";

import EventDetailsHookSummary from "./EventDetailsHookSummary";

const styles = theme => ({
  alignmentFix: {
    boxSizing: "border-box",
  },
  expand: {
    color: theme.palette.text.secondary },
  // NOTE: Ensure that codeblock does not escape container on smaller viewports.
  code: {
    width: 0,
    minWidth: "100%",
  }
});

class EventDetailsCheckSummary extends React.PureComponent {
  static propTypes = {
    check: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static fragments = {
    event: gql`
      fragment EventDetailsCheckSummary_event on Event {
        isSilenced
      }
    `,
    check: gql`
      fragment EventDetailsCheckSummary_check on Check {
        status
        lastOK
        occurrences
        occurrencesWatermark
        name
        executed
        issued
        duration
        output
        silenced
        command
        subscriptions
        stdin
        highFlapThreshold
        lowFlapThreshold
        interval
        cron
        timeout
        ttl
        totalStateChange
        roundRobin
        handlers {
          name
        }
        checkHooks {
          hooks
        }
        hooks {
          ...EventDetailsHookSummary_hook
        }
        assets: runtimeAssets {
          id
          name
        }
        outputMetricFormat
        outputMetricHandlers {
          name
        }
        metadata {
          ...LabelsAnnotationsCell_objectmeta
        }
      }

      ${LabelsAnnotationsCell.fragments.objectmeta}
      ${EventDetailsHookSummary.fragments.hook}
    `,
    entity: gql`
      fragment EventDetailsCheckSummary_entity on Entity {
        name
        namespace
      }
    `,
  };

  renderHooks() {
    const { checkHooks } = this.props.check;
    const hooks = Object.values(
      checkHooks.reduce(
        (h, list) =>
          list.hooks.reduce((j, val) => Object.assign(j, { [val]: val }), h),
        {},
      ),
    );

    return this.renderList(hooks);
  }

  renderAssets = () => {
    const { assets } = this.props.check;
    return this.renderList(assets.map(asset => asset.name));
  };

  renderList = items => {
    if (items.length === 0) {
      return "—";
    }
    return (
      <List disablePadding>
        {items.map(item => (
          <DetailedListItem key={item}>
            <DetailedListItemTitle>{item}</DetailedListItemTitle>
          </DetailedListItem>
        ))}
      </List>
    );
  };

  render() {
    const { event, check, entity, classes } = this.props;
    const statusCode = check.status;
    const status = statusCodeToId(check.status);
    const formatter = new Intl.NumberFormat("en-US");

    return (
      <Card>
        <CardHighlight color={status} />
        <CardContent>
          <Typography variant="h5" paragraph>
            Check Result
            {event.isSilenced && (
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
                <DictionaryEntry>
                  <DictionaryKey>Total State Change</DictionaryKey>
                  <DictionaryValue>
                    {check.totalStateChange || 0}
                    {"%"}
                  </DictionaryValue>
                </DictionaryEntry>

                {check.silenced.length > 0 && (
                  <DictionaryEntry>
                    <DictionaryKey>Silenced By</DictionaryKey>
                    <DictionaryValue>
                      {check.silenced.join(", ")}
                    </DictionaryValue>
                  </DictionaryEntry>
                )}
                <DictionaryEntry>
                  <DictionaryKey>Last OK</DictionaryKey>
                  <DictionaryValue>
                    <Maybe value={check.lastOK} fallback="Never">
                      {val => (
                        <RelativeToCurrentDate dateTime={val} capitalize />
                      )}
                    </Maybe>
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>Occurrences</DictionaryKey>
                  <DictionaryValue>
                    {formatter.format(check.occurrences)}
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>Max Occurrences</DictionaryKey>
                  <DictionaryValue>
                    {formatter.format(check.occurrencesWatermark)}
                  </DictionaryValue>
                </DictionaryEntry>
              </Dictionary>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Dictionary>
                <DictionaryEntry>
                  <DictionaryKey>Check</DictionaryKey>
                  <DictionaryValue>
                    {check.name !== "keepalive" ? (
                      <NamespaceLink
                        component={InlineLink}
                        namespace={entity.namespace}
                        to={`/checks/${check.name}`}
                      >
                        {check.name}
                      </NamespaceLink>
                    ) : (
                      check.name
                    )}
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>Entity</DictionaryKey>
                  <DictionaryValue>
                    <NamespaceLink
                      component={InlineLink}
                      namespace={entity.namespace}
                      to={`/entities/${entity.name}`}
                    >
                      {entity.name}
                    </NamespaceLink>
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>Issued at</DictionaryKey>
                  <DictionaryValue>
                    <DateStringFormatter
                      component={DateTime}
                      dateTime={check.issued}
                      short
                      second="numeric"
                    />
                  </DictionaryValue>
                </DictionaryEntry>
                <DictionaryEntry>
                  <DictionaryKey>Ran at</DictionaryKey>
                  <DictionaryValue>
                    <DateStringFormatter
                      component={KitchenTime}
                      dateTime={check.executed}
                      second="numeric"
                    />
                    {" for "}
                    <Duration duration={check.duration * 1000} />
                  </DictionaryValue>
                </DictionaryEntry>
              </Dictionary>
            </Grid>
          </Grid>
        </CardContent>
        {check.output ? (
          <React.Fragment>
            <Divider />
            <CodeBlock className={classes.code}>
              <CardContent><ANSIColor>{check.output}</ANSIColor></CardContent>
            </CodeBlock>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Divider />
            <CardContent>
              <Typography color="textSecondary" align="center">
                Check did not write to STDOUT.
              </Typography>
            </CardContent>
          </React.Fragment>
        )}
        {check.hooks.map(hook => (
          <EventDetailsHookSummary key={hook.config.name} hook={hook} />
        ))}
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="button" className={classes.expand}>
              Check Configuration Summary
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6}>
                <Dictionary>
                  <DictionaryEntry>
                    <DictionaryKey>Check</DictionaryKey>
                    <DictionaryValue>
                      {check.name !== "keepalive" ? (
                        <NamespaceLink
                          component={InlineLink}
                          namespace={entity.namespace}
                          to={`/checks/${check.name}`}
                        >
                          {check.name}
                        </NamespaceLink>
                      ) : (
                        check.name
                      )}
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>STDIN</DictionaryKey>
                    <DictionaryValue>
                      <CodeHighlight
                        language="bash"
                        component={Code}
                        code={check.stdin || "false"}
                      />
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Subscriptions</DictionaryKey>
                    <DictionaryValue>
                      {check.subscriptions.length > 0 ? (
                        <List disablePadding>
                          {check.subscriptions.map(subscription => (
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
                  <DictionaryEntry>
                    <DictionaryKey>Timeout</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={check.timeout} fallback="Never">
                        {timeout => `${timeout}s`}
                      </Maybe>
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>TTL</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={check.ttl} fallback="Forever">
                        {ttl => `${ttl}s`}
                      </Maybe>
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Handlers</DictionaryKey>
                    <DictionaryValue>
                      {check.handlers.length > 0 ? (
                        <List disablePadding>
                          {check.handlers.map(handler => (
                            <DetailedListItem key={handler.name}>
                              <DetailedListItemTitle>
                                {handler.name}
                              </DetailedListItemTitle>
                            </DetailedListItem>
                          ))}
                        </List>
                      ) : (
                        "—"
                      )}
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Hooks</DictionaryKey>
                    <DictionaryValue>{this.renderHooks()}</DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Assets</DictionaryKey>
                    <DictionaryValue>{this.renderAssets()}</DictionaryValue>
                  </DictionaryEntry>
                </Dictionary>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Dictionary>
                  <DictionaryEntry>
                    <DictionaryKey>Command</DictionaryKey>
                    <DictionaryValue scrollableContent>
                      {check.command ? (
                        <CodeBlock>
                          <CodeHighlight
                            language="bash"
                            code={check.command}
                            component="code"
                          />
                        </CodeBlock>
                      ) : (
                        "—"
                      )}
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Schedule</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={check.cron} fallback={`${check.interval}s`}>
                        {cron => (
                          <CronDescriptor capitalize expression={cron} />
                        )}
                      </Maybe>
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Round Robin</DictionaryKey>
                    <DictionaryValue>
                      {check.roundRobin ? "Yes" : "No"}
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Flap Threshold</DictionaryKey>
                    <DictionaryValue>
                      High: {check.highFlapThreshold} Low:{" "}
                      {check.lowFlapThreshold}
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Accepts STDIN?</DictionaryKey>
                    <DictionaryValue>
                      {check.stdin ? "Yes" : "No"}
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Metric Format</DictionaryKey>
                    <DictionaryValue>
                      <Maybe value={check.outputMetricFormat} fallback="None" />
                    </DictionaryValue>
                  </DictionaryEntry>
                  <DictionaryEntry>
                    <DictionaryKey>Metric Handlers</DictionaryKey>
                    <DictionaryValue>
                      {check.outputMetricHandlers.length > 0 ? (
                        <List disablePadding>
                          {check.outputMetricHandlers.map(handler => (
                            <DetailedListItem key={handler.name}>
                              <DetailedListItemTitle>
                                {handler.name}
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
            </Grid>
          </ExpansionPanelDetails>

          <Divider />

          <ExpansionPanelDetails>
            <LabelsAnnotationsCell resource={check} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Card>
    );
  }
}

export default withStyles(styles)(EventDetailsCheckSummary);
