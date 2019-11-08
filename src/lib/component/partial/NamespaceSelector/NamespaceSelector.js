import React from "/vendor/react";
import PropTypes from "prop-types";

import { ButtonBase as Button } from "/vendor/@material-ui/core";
import { makeStyles } from "/vendor/@material-ui/styles";

import NamespaceSelectorBuilder from "./NamespaceSelectorBuilder";

const useStyles = makeStyles(() => ({
  button: {
    width: "100%",
    padding: "8px 16px 8px 16px",
    display: "block",
    textAlign: "left",
  },
}));

const NamespaceSelector = ({ namespace, onClick, ...props }) => {
  const classes = useStyles();

  return (
    <div {...props}>
      <Button
        className={classes.button}
        onClick={onClick}
      >
        <NamespaceSelectorBuilder namespace={namespace} />
      </Button>
    </div>
  );
};

NamespaceSelector.propTypes = {
  namespace: PropTypes.object,
  onClick: PropTypes.func,
};

NamespaceSelector.defaultProps = {
  namespace: null,
  onClick: () => null,
};

export default NamespaceSelector;
