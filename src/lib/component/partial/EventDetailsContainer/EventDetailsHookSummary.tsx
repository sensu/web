import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import {
  useTheme,
  useMediaQuery,
  withStyles,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "/vendor/@material-ui/core";
import {
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
  KitchenTime,
  Duration,
  InlineLink,
  CodeBlock,
  CodeHighlight,
} from "/lib/component/base";
import { Maybe } from "/lib/component/util";

//
// Constants

const hookOutputThreshold = 127;

const Strong = withStyles(() => ({
  root: {
    color: "inherit",
    fontSize: "inherit",
    fontWeight: 600,
  },
}))(Typography);

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

const EventDetailsHookSummary = ({ hook }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [dialogOpen, setDialogOpen] = React.useState(false);

  let dialog;
  if (dialogOpen) {
    dialog = (
      <Dialog
        open
        fullWidth
        fullScreen={fullScreen}
        maxWidth="md"
        aria-labelledby={`hook-summary-dialog-title-${hook.config.name}`}
      >
        <DialogTitle id={`hook-summary-dialog-title-${hook.config.name}`}>
          Hook Output
        </DialogTitle>
        <CodeBlock>
          <DialogContent>{hook.output}</DialogContent>
        </CodeBlock>
        <DialogActions>
          <Button autoFocus onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  let output;
  if (hook.output.length > hookOutputThreshold) {
    output = (
      <React.Fragment>
        Output omitted due to length.{" "}
        <InlineLink component="a" href="#" onClick={() => setDialogOpen(true)}>
          Click to view
        </InlineLink>
        .
      </React.Fragment>
    );
  } else {
    output = (
      <Maybe value={hook.output} fallback="Did not write to STDOUT">
        <CodeBlock>
          <Box padding={2}>{hook.output}</Box>
        </CodeBlock>
      </Maybe>
    );
  }

  return (
    <Dictionary>
      <DictionaryEntry>
        <DictionaryKey>Hook</DictionaryKey>
        <DictionaryValue>
          <Strong>{hook.config.name}</Strong>
        </DictionaryValue>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryKey>Command</DictionaryKey>
        <DictionaryValue scrollableContent>
          <CodeBlock>
            <CodeHighlight
              language="bash"
              code={hook.config.command}
              component="code"
            />
          </CodeBlock>
        </DictionaryValue>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryKey>Ran at</DictionaryKey>
        <DictionaryValue>
          <KitchenTime value={new Date(hook.executed)} />
          {" for "}
          <Duration duration={hook.duration * 1000} />
        </DictionaryValue>
      </DictionaryEntry>
      <DictionaryEntry>
        <DictionaryKey>Exit Code</DictionaryKey>
        <DictionaryValue>{hook.status}</DictionaryValue>
      </DictionaryEntry>
      <DictionaryEntry
        fullWidth={
          hook.output.length <= hookOutputThreshold && hook.output.length > 0
        }
      >
        <DictionaryKey>Ouput</DictionaryKey>
        <DictionaryValue>{output}</DictionaryValue>
      </DictionaryEntry>

      {dialog}
    </Dictionary>
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
