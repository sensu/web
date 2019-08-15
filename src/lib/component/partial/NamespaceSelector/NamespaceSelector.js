import React, { useState, useCallback } from "/vendor/react";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import { ButtonBase as Button } from "/vendor/@material-ui/core";
import { makeStyles } from "/vendor/@material-ui/styles";
import { useQuery } from "/lib/component/util";
import { PollingDuration } from "/lib/constant";

import NamespaceSelectorBuilder from "./NamespaceSelectorBuilder";
import NamespaceSelectorMenu from "./NamespaceSelectorMenu";

const query = gql`
  query FetchCuratedNamespaces {
    namespaces: curatedNamespaces @client {
      name
    }
  }
`;

const useStyles = makeStyles(() => ({
  button: {
    width: "100%",
    padding: "8px 16px 8px 16px",
    display: "block",
    textAlign: "left",
  },
}));

const NamespaceSelector = ({ namespace, onChange, ...props }) => {
  const classes = useStyles();
  const results = useQuery({ query, pollInterval: PollingDuration.infrequent });
  const { namespaces = [] } = results.data || {};

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = useCallback(ev => setAnchorEl(ev.currentTarget), [
    setAnchorEl,
  ]);
  const onClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);

  return (
    <div {...props}>
      <Button
        aria-owns="drawer-selector-menu"
        className={classes.button}
        onClick={handleClick}
      >
        <NamespaceSelectorBuilder namespace={namespace} />
      </Button>
      <NamespaceSelectorMenu
        anchorEl={anchorEl}
        id="drawer-selector-menu"
        namespaces={namespaces}
        open={Boolean(anchorEl)}
        onClose={onClose}
        onClick={ev => {
          onClose();
          onChange(ev);
        }}
      />
    </div>
  );
};

NamespaceSelector.propTypes = {
  namespace: PropTypes.object,
  onChange: PropTypes.func,
};

NamespaceSelector.defaultProps = {
  namespace: null,
  onChange: () => null,
};

export default NamespaceSelector;
