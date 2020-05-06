/* eslint-disable react/sort-comp */
/* eslint-disable react/prop-types */

import React from "/vendor/react";

import { LinearProgress } from "/vendor/@material-ui/core";
import { isApolloError } from "apollo-client/errors/ApolloError";
import { FetchError } from "/lib/error";
import { Toast } from "/lib/component/base";
import { usePromiseBoundToast } from "/lib/component/relocation";

const toPastTense = action => {
  if (action === "edit") {
    return "edited";
  } else if (action === "delete") {
    return "deleted";
  }
  return "created";
};

const toPresentParticiple = action => {
  if (action === "edit") {
    return "editing";
  } else if (action === "delete") {
    return "deleting";
  }
  return "creating";
};

const toUpper = str => {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};

const ManageResourceStatusToast = ({
  action,
  onClose,
  resolved,
  rejected,
  resourceName,
  resourceType,
  batch,
  error,
}) => {
  let subject;
  if (batch) {
    subject = `${resourceType}s`;
  } else if (!resourceName) {
    subject = resourceType;
  } else {
    subject = (
      <React.Fragment>
        <strong>{resourceName}</strong>
      </React.Fragment>
    );
  }


  if (resolved) {
    return (
      <Toast
        maxAge={5000}
        variant="success"
        message={
          <span>
            {toUpper(subject)} {batch ? "were" : "was"} {toPastTense(action)}.
          </span>
        }
        onClose={onClose}
      />
    );
  }

  if (rejected) {
    return (
      <Toast
        variant="error"
        message={
          <span>
            Failed to {action} {subject}{error ? `, ${error.message}` : ""}.
          </span>
        }
        onClose={onClose}
      />
    );
  }

  return (
    <Toast
      variant="info"
      progress={<LinearProgress />}
      message={
        <span>
          {toUpper(toPresentParticiple(action))} {subject}.
        </span>
      }
      onClose={onClose}
    />
  );
};

export default ManageResourceStatusToast;

export const useManageResourceStatusToast = () => {
  const createToast = usePromiseBoundToast();

  return (promise, { action, resourceType, resourceName, batch }) =>
    createToast(
      promise,
      ({ resolved, rejected, remove, error }) => (
        <ManageResourceStatusToast
          onClose={remove}
          resolved={resolved}
          rejected={rejected}
          error={error}
          action={action}
          resourceName={resourceName}
          resourceType={resourceType}
          batch={batch}
        />
      ),
      error => {
        if (
          error instanceof FetchError ||
          error.networkError instanceof FetchError ||
          // HACK: Capture root-level query errors that vaguely match unauthorized errors
          // and open toast.
          (isApolloError(error) && /request unauthorized/.test(error.message))
        ) {
          // Display any FetchError instance in the toast.
          return error;
        }

        // Otherwise allow the app to crash.
        throw error;
      },
    );
};
