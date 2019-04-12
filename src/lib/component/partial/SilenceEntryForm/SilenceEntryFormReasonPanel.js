import React from "/vendor/react";
import { Field } from "/vendor/@10xjs/form";

import { Typography, TextField } from "/vendor/@material-ui/core";

import Panel from "./SilenceEntryFormPanel";

class SilenceEntryFormReasonPanel extends React.PureComponent {
  render() {
    return (
      <Field path="props.reason">
        {({ input, rawValue }) => (
          <Panel
            title="Reason"
            summary={input.value}
            hasDefaultValue={!rawValue}
          >
            <Typography color="textSecondary">
              Explanation for the creation of this entry.
            </Typography>

            <TextField
              label="Reason"
              multiline
              fullWidth
              rowsMax="4"
              margin="normal"
              {...input}
            />
          </Panel>
        )}
      </Field>
    );
  }
}

export default SilenceEntryFormReasonPanel;
