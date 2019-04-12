import React from "/vendor/react";
import PropTypes from "prop-types";

import { defaultNamespace } from "/lib/constant/namespace";

import {
  CheckIcon,
  EntityIcon,
  EventIcon,
  SilenceIcon,
} from "/lib/component/icon";

import Button from "./Button";

class QuickNav extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    namespace: PropTypes.string,
  };

  static defaultProps = { className: "", namespace: defaultNamespace };

  render() {
    const { className, namespace } = this.props;

    return (
      <div className={className}>
        <Button
          namespace={namespace}
          Icon={EventIcon}
          caption="Events"
          to="events"
        />
        <Button
          namespace={namespace}
          Icon={EntityIcon}
          caption="Entities"
          to="entities"
        />
        <Button
          namespace={namespace}
          Icon={CheckIcon}
          caption="Checks"
          to="checks"
        />
        <Button
          namespace={namespace}
          Icon={SilenceIcon}
          caption="Silences"
          to="silences"
        />
      </div>
    );
  }
}

export default QuickNav;
