import React, { useState, useEffect } from "react";

import { List } from "/vendor/@material-ui/core";
import { ChevronIcon } from "/lib/component/icon";
import { NamespaceIcon } from "/lib/component/partial";

import ContextSwitcherListHeader from "./ContextSwitcherListHeader";
import ContextSwitcherListItem from "./ContextSwitcherListItem";
import ContextSwitcherListLoading from "./ContextSwitcherListLoading";
import ContextSwitcherListEmpty from "./ContextSwitcherListEmpty";
import ContextSwitcherListNoData from "./ContextSwitcherListNoData";

interface NamespaceGroup {
  [cluster: string]: string[];
}

interface Props {
  namespaces: {
    name: string;
    clusters?: string[];
  }[];
  dense: boolean;
  loading: boolean;
  filtered: boolean;
}

const ContextSwitcherList = ({
  dense,
  loading,
  namespaces,
  filtered,
}: Props) => {
  // Group namespaces by cluster
  let groups = namespaces.reduce<NamespaceGroup>((acc, namespace) => {
    return (namespace.clusters || []).reduce((acc, cluster) => {
      return { ...acc, [cluster]: [...(acc[cluster] || []), namespace.name] };
    }, acc);
  }, {});

  // Account for un-clustered environments by referring namespaces as being in
  // the "local cluster".
  if (Object.keys(groups).length === 0 && namespaces.length > 0) {
    groups = {
      "local-cluster": namespaces.map((namespace) => namespace.name),
    };
  }

  // Find total length of the list
  const totalLen = Object.keys(groups).reduce(
    (acc, key) => acc + groups[key].length,
    0,
  );

  // Handle current position in the collection
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const onKeyPress = (ev: KeyboardEvent) => {
      if (ev.code === "Tab" || ev.code === "ArrowDown") {
        setIdx(Math.min(idx + 1, totalLen));
        ev.preventDefault();
      }

      if ((ev.code === "Tab" && ev.shiftKey) || ev.code === "ArrowUp") {
        setIdx(Math.max(idx - 1, 0));
        ev.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyPress, false);
    return () => window.removeEventListener("keydown", onKeyPress);
  }, [idx, setIdx, totalLen]);

  // Find currently selected index
  const selected = Math.min(Math.max(idx, 0), totalLen - 1);

  // If the order of namespaces isn't important, sort of the cluster names
  // alphabetically.
  let clusterNames = Object.keys(groups);
  if (!filtered) {
    clusterNames = clusterNames.sort();
  }

  // Select entries when hovered.
  const onFocus = (i: number) => () => setIdx(i);

  if (loading) {
    return <ContextSwitcherListLoading dense={dense} />;
  }

  if (namespaces.length === 0) {
    if (filtered) {
      return <ContextSwitcherListEmpty />;
    }
    return <ContextSwitcherListNoData />;
  }

  let i = -1;
  return (
    <List disablePadding dense={dense}>
      {clusterNames.map((cluster) => (
        <React.Fragment key={cluster}>
          <ContextSwitcherListHeader>{cluster}</ContextSwitcherListHeader>

          {groups[cluster].map((name) => {
            i++;

            return (
              <ContextSwitcherListItem
                key={name}
                icon={<NamespaceIcon namespace={{ name }} />}
                primary={name}
                decoration={<ChevronIcon direction="right" />}
                selected={i === selected}
                onMouseEnter={onFocus(i)}
              />
            );
          })}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ContextSwitcherList;
