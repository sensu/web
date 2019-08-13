import React from "/vendor/react";
import PropTypes from "prop-types";
import { Route } from "/vendor/react-router-dom";
import { withStyles, ButtonBase as Button } from "/vendor/@material-ui/core";

import { WithNamespaces } from "/lib/component/util";
import NamespaceSelectorBuilder from "./NamespaceSelectorBuilder";
import NamespaceSelectorMenu from "./NamespaceSelectorMenu";

const styles = () => ({
  button: {
    width: "100%",
    padding: "8px 16px 8px 16px",
    display: "block",
    textAlign: "left",
  },
});

class NamespaceSelector extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    namespace: PropTypes.object,
    loading: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    viewer: PropTypes.object,
  };

  static defaultProps = {
    viewer: null,
    namespace: null,
    loading: false,
  };

  state = {
    anchorEl: null,
  };

  onClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const {
      classes,
      namespace,
      loading,
      onChange,
      viewer,
      ...props
    } = this.props;
    const { anchorEl } = this.state;

    return (
      <Route
        path="/:namespace"
        render={({ match: { params } }) => (
          <div {...props}>
            <Button
              aria-owns="drawer-selector-menu"
              className={classes.button}
              onClick={this.handleClick}
            >
              <NamespaceSelectorBuilder namespace={namespace} />
            </Button>
            <WithNamespaces>
              {namespaces => (
                <NamespaceSelectorMenu
                  anchorEl={anchorEl}
                  id="drawer-selector-menu"
                  namespaces={namespaces}
                  org={params.organization}
                  open={Boolean(anchorEl)}
                  onClose={this.onClose}
                  onClick={ev => {
                    this.onClose();
                    onChange(ev);
                  }}
                />
              )}
            </WithNamespaces>
          </div>
        )}
      />
    );
  }
}

export default withStyles(styles)(NamespaceSelector);
