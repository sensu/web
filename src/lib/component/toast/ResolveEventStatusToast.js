/* eslint-disable react/sort-comp */
/* eslint-disable react/prop-types */

import React from "/vendor/react";

import { LinearProgress } from "/vendor/@material-ui/core";
import { NamespaceLink } from "/lib/component/util";
import { InlineLink, Toast } from "/lib/component/base";

const ResolveEventStatusToast = ({
  onClose,
  resolved,
  rejected,
  error,
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
            Resolved {subject}.{" "}
            <InlineLink
              component={NamespaceLink}
              namespace={namespace}
              to={`/events?filter=${encodeURIComponent(
                `check.name === "${checkName}"${
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
        message={
          <span>{error.message || `Failed to resolve ${subject}.`}</span>
        }
        onClose={onClose}
      />
    );
  }

  return (
    <Toast
      variant="info"
      progress={<LinearProgress />}
      message={<span>Resolving {subject}.</span>}
      onClose={onClose}
    />
  );
};

export default ResolveEventStatusToast;
