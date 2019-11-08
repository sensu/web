import React, { useMemo, useEffect, useState } from "react";
import times from "lodash/times";

import { List } from "/vendor/@material-ui/core";
import { ChevronIcon } from "/lib/component/icon";
import NamespaceIcon from "/lib/component/partial/NamespaceIcon";

import ContextSwitcherListHeader from "./ContextSwitcherListHeader";
import ContextSwitcherListItem from "./ContextSwitcherListItem";
import ContextSwitcherListLoading from "./ContextSwitcherListLoading";
import ContextSwitcherListEmpty from "./ContextSwitcherListEmpty";
import ContextSwitcherListNoData from "./ContextSwitcherListNoData";

interface Namespace {
  name: string;
  cluster: string;
}

interface ClusterRange {
  name: string;
  range: [number, number?];
}

interface Props {
  namespaces: Namespace[];
  dense: boolean;
  loading: boolean;
  filtered: boolean;
  onSelect: (selected: Namespace) => void;
}

const ContextSwitcherList = ({
  dense,
  loading,
  namespaces,
  filtered,
  onSelect,
}: Props) => {
  const items = useMemo(
    () =>
      namespaces.sort((a, b) => {
        if (a.cluster === b.cluster) {
          return 0;
        }
        if (a.cluster > b.cluster) {
          return 1;
        }
        return -1;
      }),
    [namespaces],
  );

  const clusters = useMemo(
    () =>
      items.reduce<ClusterRange[]>((acc, item, idx) => {
        const last = acc.pop();
        const name = item.cluster || "local-cluster";
        if (!last) {
          return [{ name, range: [idx] }];
        }
        if (last.name !== item.cluster) {
          return [
            ...acc,
            { ...last, range: [last.range[0], idx] },
            { name, range: [idx, idx + 1] },
          ];
        }
        return [last, ...acc];
      }, []),
    [items],
  );

  // Handle current position in the collection
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const onKeyPress = (ev: KeyboardEvent) => {
      if (ev.code === "Tab" || ev.code === "ArrowDown") {
        setIdx(Math.min(idx + 1, items.length));
        ev.preventDefault();
      }

      if ((ev.code === "Tab" && ev.shiftKey) || ev.code === "ArrowUp") {
        setIdx(Math.max(idx - 1, 0));
        ev.preventDefault();
      }

      if (ev.code === "Enter") {
        onSelect(items[idx]); // TODO
        ev.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyPress, false);
    return () => window.removeEventListener("keydown", onKeyPress);
  }, [idx, setIdx, onSelect, items]);

  // Find currently selected index
  const selected = Math.min(Math.max(idx, 0), items.length - 1);

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

  return (
    <List disablePadding dense={dense}>
      {clusters.map((cluster) => (
        <React.Fragment key={cluster.name}>
          <ContextSwitcherListHeader>{cluster.name}</ContextSwitcherListHeader>

          {times((cluster.range[1] || items.length) - cluster.range[0]).map(
            (i: number) => {
              const j = i + cluster.range[0];
              const record = items[j];

              return (
                <ContextSwitcherListItem
                  key={record.name}
                  icon={<NamespaceIcon namespace={record} />}
                  primary={record.name}
                  decoration={<ChevronIcon direction="right" />}
                  selected={j === selected}
                  onMouseEnter={onFocus(j)}
                  onClick={() => onSelect(record)}
                />
              );
            },
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ContextSwitcherList;
