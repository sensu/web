/* eslint-disable react/sort-comp */
/* eslint-disable react/prop-types */

import React from "/vendor/react";

import { useToast } from "/lib/component/relocation";
import { NamespaceLink } from "/lib/component/util";
import { InlineLink, Toast } from "/lib/component/base";

const CreateSilenceStatusToast = ({ onClose, error, namespace }) => {
  if (!error) {
    return (
      <Toast
        maxAge={5000}
        variant="success"
        message={
          <span>
            Successfully created silence.{" "}
            <InlineLink
              component={NamespaceLink}
              namespace={namespace}
              to={`/silences`}
            >
              View&nbsp;silenced&nbsp;entries.
            </InlineLink>
          </span>
        }
        onClose={onClose}
      />
    );
  }

  return (
    <Toast
      variant="error"
      message={
        <span>{error.message || "Failed to create silence."}</span>
      }
      onClose={onClose}
    />
  );
};

export default CreateSilenceStatusToast;

export const useCreateSilenceStatusToast = () => {
  const createToast = useToast();

  return ({ namespace, error }) =>
    createToast(
      `silences.create`,
      ({ remove }) => <CreateSilenceStatusToast
        error={error}
        namespace={namespace}
        onClose={remove}
      />,
    );
};
