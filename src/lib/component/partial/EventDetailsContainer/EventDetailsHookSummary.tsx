import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import {
  makeStyles,
  createStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "/vendor/@material-ui/core";
import {
  KitchenTime,
  Duration,
  CodeBlock,
  CodeHighlight,
} from "/lib/component/base";
import { ExpandMoreIcon } from "/lib/component/icon";

interface Props {
  hook: {
    config: {
      name: string;
      command: string;
    };
    executed: number;
    duration: number;
    status: number;
    output: string;
  };
}

const fb = (str: string, fallback: string) => {
  if (!str) {
    return fallback;
  }
  return str;
};

const useStyles = makeStyles(() =>
  createStyles({
    heading: {
      flex: "1 1 auto",
      alignSelf: "center",
    },
    subheading: {
      alignSelf: "center",
    },
    // NOTE: Ensure that codeblock does not escape container on smaller viewports.
    code: {
      width: 0,
      minWidth: "100%",
    },
  }),
);

const EventDetailsHookSummary = ({ hook }: Props) => {
  const classes = useStyles();
  const panelId = `hook-panel-${hook.config.name}`;

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${panelId}-content`}
        id={`${panelId}-header`}
      >
        <Typography
          variant="button"
          color="textSecondary"
          className={classes.heading}
        >
          Hook: {hook.config.name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.subheading}
        >
          Ran at <KitchenTime value={new Date(hook.executed)} /> for{" "}
          <Duration duration={hook.duration * 1000} />
        </Typography>
      </ExpansionPanelSummary>
      <CodeBlock className={classes.code}>
        <ExpansionPanelDetails>
          <CodeHighlight
            language="bash"
            code={[
              fb(hook.output.trim(), "# Did not write to STDOUT"),
              `# Exited with status ${hook.status}`,
            ]
              .filter((v) => !!v)
              .join("\n\n")}
            component="code"
          />
        </ExpansionPanelDetails>
      </CodeBlock>
    </ExpansionPanel>
  );
};

EventDetailsHookSummary.fragments = {
  hook: gql`
    fragment EventDetailsHookSummary_hook on Hook {
      config {
        name
        command
      }
      duration
      executed
      status
      output
    }
  `,
};

export default EventDetailsHookSummary;
