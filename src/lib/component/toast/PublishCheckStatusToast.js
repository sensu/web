/* eslint-disable react/sort-comp */
/* eslint-disable react/prop-types */

import React from "/vendor/react";
import { LinearProgress } from "/vendor/@material-ui/core";

import { FetchError } from "/lib/error";

import { Toast } from "/lib/component/base";

import { usePromiseBoundToast } from "/lib/component/relocation";

const PublishCheckStatusToast = ({
  onClose,
  resolved,
  rejected,
  checkName,
  publish,
}) => {
  const subject = (
    <React.Fragment>
      <strong>{checkName}</strong>
    </React.Fragment>
  );

  if (resolved) {
    return (
      <Toast
        maxAge={5000}
        variant="success"
        message={
          <span>
            {publish ? "Published" : "Unpublished"} {subject}.{" "}
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
            Failed to {publish ? "publish" : "unpublish"} {subject}.
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
          {publish ? "Publishing" : "Unpublishing"} {subject}.
        </span>
      }
      onClose={onClose}
    />
  );
};

export default PublishCheckStatusToast;

export const usePublishCheckStatusToast = () => {
  const createToast = usePromiseBoundToast();

  return (promise, { checkName, publish }) =>
    createToast(
      promise,
      ({ resolved, rejected, remove, error }) => (
        <PublishCheckStatusToast
          onClose={remove}
          resolved={resolved}
          rejected={rejected}
          error={error}
          checkName={checkName}
          publish={publish}
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
