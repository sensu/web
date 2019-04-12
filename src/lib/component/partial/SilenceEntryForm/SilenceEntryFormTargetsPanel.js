import React from "/vendor/react";
import { Field } from "/vendor/@10xjs/form";
import PropTypes from "prop-types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "/vendor/@material-ui/core/";

import Panel from "./SilenceEntryFormPanel";

class SilenceEntryFormTargetsPanel extends React.PureComponent {
  static propTypes = {
    formatError: PropTypes.func.isRequired,
  };

  render() {
    const { formatError } = this.props;
    return (
      <Field
        path="targets"
        format={value => (value === undefined ? [] : value)}
      >
        {({ input, error }) => (
          <Panel
            title="Targets"
            summary={`${input.value.length} targets selected`}
            hasDefaultValue={false}
            error={error && "Encountered errors creating silencing entries."}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Check</TableCell>
                  <TableCell>Subscription</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {input.value.map((target, i) => (
                  <TableRow key={`${target.subscription}:${target.check}`}>
                    <TableCell>
                      {target.check || "*"}
                      {error && error[i] && error[i].check && (
                        <div>
                          <Typography color="error">
                            {formatError(error[i].check)}
                          </Typography>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{target.subscription || "*"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        )}
      </Field>
    );
  }
}

export default SilenceEntryFormTargetsPanel;
