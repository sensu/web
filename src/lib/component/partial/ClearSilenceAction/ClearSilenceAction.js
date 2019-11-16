import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import ClearSilencedEntriesDialog from "/lib/component/partial/ClearSilencedEntriesDialog";

class ClearSilenceAction extends React.PureComponent {
  static propTypes = {
    record: PropTypes.object,
    children: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
  };

  static defaultProps = {
    record: null,
  };

  static fragments = {
    record: gql`
      fragment ClearSilenceAction_record on Silenceable {
        silences {
          ...ClearSilencedEntriesDialog_silence
        }
      }

      ${ClearSilencedEntriesDialog.fragments.silence}
    `,
  };

  state = { isOpen: false };

  render() {
    const { record, children } = this.props;
    const { isOpen } = this.state;

    const open = () => this.setState({ isOpen: true });
    const canOpen = record.silences.length > 0;

    return (
      <React.Fragment>
        {children({ canOpen, open })}
        <ClearSilencedEntriesDialog
          silences={record.silences}
          open={isOpen}
          onSave={this.props.onDelete}
          onClose={() => {
            this.props.onDone();
            this.setState({ isOpen: false });
          }}
        />
      </React.Fragment>
    );
  }
}

export default ClearSilenceAction;
