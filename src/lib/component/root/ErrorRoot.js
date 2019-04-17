/* eslint-disable react/prop-types */
import React from "/vendor/react";

import ErrorStackParser from "error-stack-parser";

import {
  Link,
  Typography,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "/vendor/@material-ui/core";

import { unwrapError } from "/lib/util/error";
import { useBuildInfo, createStyledComponent } from "/lib/component/util";
import { ExpandMoreIcon } from "/lib/component/icon";

import ErrorDialog from "/lib/component/base/ErrorDialog";

const Pre = createStyledComponent({
  component: "pre",
  styles: () => ({
    maxWidth: "100%",
    overflowX: "auto",
    lineHeight: 1.5,
    fontSize: 14,
    fontFamily: `"SFMono-Regular", Consolas, "Liberation Mono", Menlo,Courier, monospace`,
  }),
});

const ExpansionPanelWrapper = createStyledComponent({
  styles: theme => ({
    marginTop: theme.spacing.unit * 3,
  }),
});

const ErrorRoot = ({ error: rawError }) => {
  const { webRevision, sensuVersion } = useBuildInfo();

  const error = React.useMemo(() => unwrapError(rawError), [rawError]);

  const frames = React.useMemo(
    () =>
      ErrorStackParser.parse(error).map(frame => {
        const fileName = frame.fileName.replace(window.location.origin, "");

        return {
          functionName: `${frame.functionName}`,
          source: `${fileName}:${frame.lineNumber}`,
        };
      }),
    [error],
  );

  const issueURL = `https://github.com/sensu/web/issues/new?title=${encodeURIComponent(
    `Unexpected Error: "${error.message}"`,
  )}&body=${encodeURIComponent(
    `
## Expected Behavior
<!--- If you're looking for help, please see https://sensuapp.org/support for resources --->
<!--- If you're describing a bug, tell us what should happen -->
<!--- If you're suggesting a change/improvement, tell us how it should work -->

## Current Behavior
<!--- If describing a bug, tell us what happens instead of the expected behavior -->
<!--- If suggesting a change/improvement, explain the difference from current behavior -->

## Possible Solution
<!--- Not obligatory, but suggest a fix/reason for the bug, -->
<!--- or ideas as to the implementation of the addition or change -->

## Steps to Reproduce (for bugs)
<!--- Provide a link to a live example, or an unambiguous set of steps to -->
<!--- reproduce this bug. Include code or configuration to reproduce, if relevant -->
1.
2.
3.
4.

## Context
<!--- How has this issue affected you? What are you trying to accomplish? -->
<!--- Providing context (e.g. links to configuration settings, stack strace or log data) helps us come up with a solution that is most useful in the real world -->

**Browser Stack Trace:**

${frames
  .slice(0, 15)
  .map(({ functionName, source }) => `at \`${functionName}\` (${source})`)
  .join("\n")}
${
  error.componentStack
    ? `


React Component Stack:

${"```"}${error.componentStack.replace(/^ {4}/gm, "")}
${"```"}`
    : ""
}

## Your Environment
<!--- Include as many relevant details about the environment you experienced the bug in -->
* Sensu version used (sensuctl, sensu-backend, and/or sensu-agent):
  sensu/web revision: \`${webRevision}\`${
      sensuVersion
        ? `
  sensu version: \`${sensuVersion}\``
        : ""
    }
* Installation method (packages, binaries, docker etc.):
* Operating System and version (e.g. Ubuntu 14.04):`.slice(0),
  )}`;

  return (
    <ErrorDialog
      open
      actions={
        <Button onClick={() => window.location.reload()} color="primary">
          Reload
        </Button>
      }
    >
      <Typography variant="body2">
        An error was encountered
        <br />
        <br />
        Please{" "}
        <Link component="a" href={issueURL}>
          submit an issue
        </Link>{" "}
        to help resolve this problem.
        <br />
        Reloading the page may be required to recover.
      </Typography>
      <ExpansionPanelWrapper>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">Expand for error details</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Pre>{error.stack}</Pre>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </ExpansionPanelWrapper>
    </ErrorDialog>
  );
};

export default React.memo(ErrorRoot);
