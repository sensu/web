import React from "/vendor/react";
import PropTypes from "prop-types";
import { Field } from "/vendor/@10xjs/form";

import { withStyles, Typography, TextField } from "/vendor/@material-ui/core";

import { Code } from "/lib/component/base";
import ResetAdornment from "/lib/component/partial/ResetAdornment";

import Panel from "./SilenceEntryFormPanel";

const MonoTextField = withStyles(theme => ({
  root: { "& input": { fontFamily: theme.typography.monospace.fontFamily } },
}))(TextField);

class SilenceEntryFormSubscriptionPanel extends React.PureComponent {
  static propTypes = {
    formatError: PropTypes.func.isRequired,
  };

  render() {
    const { formatError } = this.props;

    return (
      <Field path="subscription">
        {({ input, rawValue, error, dirty, initialValue, setValue }) => (
          <Panel
            title="Subscription"
            summary={input.value || "all entities"}
            hasDefaultValue={!rawValue}
            error={formatError(error)}
          >
            <Typography color="textSecondary">
              Enter the name of the subscription the entry should match. Use the
              format <Code>entity:$ENTITY_NAME</Code> to match a specific
              entity.
            </Typography>

            <MonoTextField
              id="silenced-subscription"
              label="Subscription"
              fullWidth
              margin="normal"
              error={!!formatError(error)}
              InputProps={{
                endAdornment: initialValue && dirty && (
                  <ResetAdornment onClick={() => setValue(initialValue)} />
                ),
              }}
              {...input}
            />
          </Panel>
        )}
      </Field>
    );
  }
}

export default SilenceEntryFormSubscriptionPanel;
