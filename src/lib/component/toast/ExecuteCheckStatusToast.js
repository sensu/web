/* eslint-disable react/sort-comp */
/* eslint-disable react/prop-types */

import React from "/vendor/react";
import { LinearProgress } from "/vendor/@material-ui/core";

import { FetchError } from "/lib/error";

import { usePromiseBoundToast } from "/lib/component/relocation";

import { NamespaceLink } from "/lib/component/util";

import { InlineLink, Toast } from "/lib/component/base";

const ExecuteCheckStatusToast = ({
  onClose,
  resolved,
  rejected,
  checkName,
  entityName,
  namespace,
}) => {
  const subject = (
    <React.Fragment>
      <strong>{checkName}</strong>
      {entityName && (
        <span>
          {" "}
          on <strong>{entityName}</strong>
        </span>
      )}
    </React.Fragment>
  );

  if (resolved) {
    return (
      <Toast
        maxAge={5000}
        variant="success"
        message={
          <span>
            Done executing {subject}.{" "}
            <InlineLink
              component={NamespaceLink}
              namespace={namespace}
              to={`/events?filters=${encodeURIComponent(
                `check:${checkName}${
                  entityName ? ` && entity.name === "${entityName}"` : ""
                }`,
              )}`}
            >
              View&nbsp;events.
            </InlineLink>
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
        // TODO: Render error details.
        message={<span>Failed to execute {subject}.</span>}
        onClose={onClose}
      />
    );
  }

  return (
    <Toast
      variant="info"
      progress={<LinearProgress />}
      message={<span>Executing {subject}.</span>}
      onClose={onClose}
    />
  );
};

export default ExecuteCheckStatusToast;

export const useExecuteCheckStatusToast = () => {
  const createToast = usePromiseBoundToast();

  return (promise, { checkName, entityName, namespace }) =>
    createToast(
      promise,
      ({ resolved, rejected, remove, error }) => (
        <ExecuteCheckStatusToast
          onClose={remove}
          resolved={resolved}
          rejected={rejected}
          error={error}
          checkName={checkName}
          entityName={entityName}
          namespace={namespace}
        />
      ),
      error => {
        if (
          error instanceof FetchError ||
          error.networkError instanceof FetchError
        ) {
          // Display any FetchError instance in the toast.
          return error;
        }

        // Otherwise allow the app to crash.
        throw error;
      },
    );
};
