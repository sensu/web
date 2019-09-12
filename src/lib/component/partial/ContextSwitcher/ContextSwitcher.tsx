import React, { useCallback, useMemo, useState } from "/vendor/react";
import {
  useTheme,
  Box,
  IconButton,
  Typography,
} from "/vendor/@material-ui/core";
import { CloseIcon } from "/lib/component/icon";
import { KeyboardInput, SearchBox } from "/lib/component/base";
import Fuse from "fuse.js";

import ContextSwitcherList from "./ContextSwitcherList";

interface Namespace {
  name: string;
  clusters: string[];
}

interface Props {
  loading: boolean;
  dense?: boolean;
  hideKeyHints?: boolean;
  namespaces: Namespace[];
  onClose?: () => void;
}

const ContextSwitcher = ({
  namespaces = [],
  dense = false,
  loading = false,
  hideKeyHints = false,
}: Props) => {
  const theme = useTheme();

  const [filterValue, setFilterValue] = useState("");
  const onFilterChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) =>
      setFilterValue(ev.currentTarget.value),
    [setFilterValue],
  );

  // Filter given collection of namespaces.
  const namespaceSearchResults = useMemo(() => {
    if (filterValue === "") {
      return namespaces.sort((a, b) => (a.name > b.name ? 1 : -1));
    }

    const fuse = new Fuse<Namespace>(namespaces, {
      keys: ["name"],
      shouldSort: true,
      threshold: 0.5,
      tokenize: true,
      tokenSeparator: /[ -]+/i,
      distance: 32,
    });
    return fuse.search(filterValue.slice(0, 12));
  }, [namespaces, filterValue]);

  return (
    <React.Fragment>
      <Box
        pr={1 / 2}
        pl={1 / 2}
        // HACK
        style={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Box display="flex">
          <Box flexGrow="1">
            <SearchBox
              variant="search"
              placeholder="Find namespaces..."
              value={filterValue}
              onChange={onFilterChange}
              tabIndex={0}
            />
          </Box>
          <Box flexGrow="0">
            <IconButton color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box flex="1 1 auto" overflow="auto">
        <ContextSwitcherList
          dense={dense}
          loading={loading}
          namespaces={namespaceSearchResults}
          filtered={filterValue !== ""}
        />
      </Box>

      {!hideKeyHints && (
        <Box
          display="flex"
          minHeight={48}
          alignItems="center"
          pl={2}
          pr={2}
          pt={1}
          pb={1}
          borderTop={1}
          borderColor="divider"
        >
          <Typography color="textPrimary">
            <KeyboardInput>↑</KeyboardInput> <KeyboardInput>↓</KeyboardInput> to
            navigate <KeyboardInput>⏎</KeyboardInput> to select
          </Typography>
        </Box>
      )}
    </React.Fragment>
  );
};

export default ContextSwitcher;
