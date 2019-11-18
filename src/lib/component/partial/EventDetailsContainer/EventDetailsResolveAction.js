import React, { useCallback } from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { isApolloError } from "apollo-client/errors/ApolloError";
import { useToast } from "/lib/component/relocation";
import { ResolveEventStatusToast } from "/lib/component/toast";

const EventDetailsResolveAction = ({ children, event, onResolve }) => {
  const createToast = useToast();
  const resolve = useCallback(() => {
    if (event.check.status === 0) {
      return;
    }

    onResolve(event).catch(error => {
      // HACK: Capture root-level query errors that vaguely match unauthorized errors
      // and open toast.
      if (isApolloError(error) && /request unauthorized/.test(error.message)) {
        createToast(`event.resolve.${event.id}`, ({ remove }) => (
          <ResolveEventStatusToast rejected error={error} onClose={remove} />
        ));
        return;
      }
      throw error;
    });
  }, [createToast, event, onResolve]);

  const canResolve = event && event.check.status > 0;
  const childProps = {
    canResolve,
    resolve,
  };

  return children(childProps);
};

EventDetailsResolveAction.propTypes = {
  children: PropTypes.func.isRequired,
  event: PropTypes.object,
  onResolve: PropTypes.func.isRequired,
};

EventDetailsResolveAction.defaultProps = {
  event: null,
};

EventDetailsResolveAction.fragments = {
  event: gql`
    fragment EventDetailsResolveAction_event on Event {
      id
      check {
        status
      }
    }
  `,
};

export default EventDetailsResolveAction;
