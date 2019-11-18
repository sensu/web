import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import SilenceEntryDialog from "/lib/component/partial/SilenceEntryDialog";

class EventDetailsSilenceAction extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    event: PropTypes.object.isRequired,
    onCreate: PropTypes.func.isRequired,
    onDone: PropTypes.func,
  };

  static defaultProps = {
    onDone: () => false,
  };

  static fragments = {
    event: gql`
      fragment EventDetailsSilenceAction_event on Event {
        namespace
        isSilenced
        check {
          name
        }
        entity {
          name
        }
      }
    `,
  };

  state = { isOpen: false };

  render() {
    const { event } = this.props;
    const { isOpen } = this.state;

    const canOpen = event.isSilenced;
    const open = () => this.setState({ isOpen: true });

    return (
      <React.Fragment>
        {this.props.children({ canOpen, open })}
        {isOpen && (
          <SilenceEntryDialog
            values={{
              namespace: event.namespace,
              check: event.check.name,
              subscription: `entity:${event.entity.name}`,
            }}
            onSave={this.props.onCreate}
            onClose={() => {
              this.props.onDone();
              this.setState({ isOpen: false });
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventDetailsSilenceAction;
