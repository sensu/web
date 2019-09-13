import React from "/vendor/react";
import PropTypes from "prop-types";
import { Form, SubmitValidationError } from "/vendor/@10xjs/form";

import { validName, validSubscriptionName } from "/lib/util/validator";
import {
  requiredError,
  invalidSymbolError,
  parseValidationErrors,
} from "/lib/util/validation";

const validate = values => {
  const errors = {};

  if (
    !values.check &&
    !values.subscription &&
    !(values.targets && values.targets.length)
  ) {
    errors.check = requiredError();
    errors.subscription = requiredError();
  }

  if (values.check && values.check !== "*" && !validName(values.check)) {
    errors.check = invalidSymbolError();
  }

  if (
    values.subscription &&
    values.subscription !== "*" &&
    !validSubscriptionName(values.subscription)
  ) {
    errors.subscription = invalidSymbolError();
  }

  return errors;
};

class SilenceEntryForm extends React.PureComponent {
  static propTypes = {
    values: PropTypes.object.isRequired,
    onCreateSilence: PropTypes.func.isRequired,
    onCreateSilenceSuccess: PropTypes.func.isRequired,
    onCreateSilenceFailure: PropTypes.func.isRequired,
    onSubmitSuccess: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
  };

  formRef = React.createRef();

  _handleSubmit = values => {
    const { onCreateSilence, onCreateSilenceSuccess, onCreateSilenceFailure } = this.props;
    const { targets, ...rest } = values;

    // To avoid redundant logic between singular and bulk bulk creation,
    // singular entries are handled as an array of one target.
    const currentTargets = targets
      ? values.targets.map(target => ({ ...target, ...rest }))
      : [rest];

    return Promise.all(currentTargets.map(onCreateSilence)).then(results => {
      const failedTagets = [];
      const succeededTargets = [];
      const errors = [];
      const failures = [];

      // Separate the individual results into sets of failed and succeeded.
      results.forEach((targetResult, i) => {
        if (targetResult.errors) {
          errors.push(parseValidationErrors(targetResult.errors));
          failedTagets.push(currentTargets[i]);

          // Find any errors returned from the GraphQL service that may not be
          // fixed by the user changing input. Eg. Unauthorized errors.
          failures.push(...targetResult.errors.reduce((acc, err) => {
            if (err.code === "VALIDATION_UNIQUE_CONSTRAINT") {
              return acc;
            }
            return [...acc, err];
          }, []))
        } else {
          succeededTargets.push(targetResult);
        }
      });

      if (succeededTargets.length) {
        // The success callback may be called while other targets have failed
        // during bulk creation.
        onCreateSilenceSuccess(succeededTargets);
      }

      if (failures.length) {
        onCreateSilenceFailure(failures[0]);
        return;
      }

      if (failedTagets.length === 1) {
        this.formRef.current.setValue("targets", undefined);
        this.formRef.current.setValue("check", failedTagets[0].check);
        this.formRef.current.setValue(
          "subscription",
          failedTagets[0].subscription,
        );
        throw new SubmitValidationError(errors[0]);
      } else if (failedTagets.length) {
        this.formRef.current.setValue("targets", failedTagets);
        throw new SubmitValidationError({ targets: errors });
      }
    });
  };

  render() {
    const { values: valuesProp, onSubmitSuccess } = this.props;

    // Insert defaults
    const values = Object.assign(valuesProp || {}, {
      props: {
        expireOnResolve: valuesProp.expireOnResolve || false,
        ...valuesProp.props,
      },
    });

    return (
      <Form
        ref={this.formRef}
        values={values}
        validate={validate}
        onSubmit={this._handleSubmit}
        onSubmitSuccess={onSubmitSuccess}
      >
        {this.props.children}
      </Form>
    );
  }
}

export default SilenceEntryForm;
