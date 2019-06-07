import React from "/vendor/react";

const arrayIntersect = <T extends any>(a: T[], b: T[]) =>
  a.filter((val) => b.includes(val));

interface RenderItemProps<T> {
  key: string;
  item: T;
  selected: boolean;
  setSelected(selected: boolean): void;
  hovered: boolean;
  setHovered(hovered: { hovered: boolean }): void;
  selectedCount: number;
  toggleSelected(): void;
}

interface RenderProps<T> {
  children: React.ReactNode;
  keys: string[];
  selectedKeys: string[];
  selectedItems: T[];
  setKeySelected(key: string, selected: boolean): void;
  setItemSelected(item: T, selected: boolean): void;
  setSelectedKeys(keys: string[]): void;
  setSelectedItems(items: T[]): void;
  toggleSelectedItems(): void;
}

interface Props<T> {
  renderItem(props: RenderItemProps<T>): JSX.Element | null;
  renderEmptyState(): JSX.Element | null;
  children(props: RenderProps<T>): JSX.Element | null;
  getItemKey(item: T): string;
  initialSelectedKeys: string[];
  items: T[];
}

interface State<T>
  extends Pick<
    Props<T>,
    "getItemKey" | "renderItem" | "children" | "renderEmptyState"
  > {
  selectedKeys: string[];
  items: T[];
  keys: string[];
  hoveredKey: string | null;
}

const setKeySelected = <T extends any>(key: string, keySelected: boolean) => (
  state: State<T>,
) => {
  if (
    keySelected &&
    // Prevent adding duplicated keys to the selectedKeys array.
    !state.selectedKeys.includes(key) &&
    // Prevent including a key that is not in the current items array.
    state.keys.includes(key)
  ) {
    const selectedKeys = state.selectedKeys.concat([key]);
    return { selectedKeys };
  }

  if (
    !keySelected &&
    // Prevent unnecessary state updates if the key is not selected.
    state.selectedKeys.includes(key)
  ) {
    const selectedKeys = state.selectedKeys.filter(
      (selectedKey) => key !== selectedKey,
    );
    return { selectedKeys };
  }

  return null;
};

const setSelectedKeys = <T extends any>(selectedKeys: string[]) => (
  state: State<T>,
) => ({
  selectedKeys: arrayIntersect(state.keys, selectedKeys),
});

class ListController<T> extends React.PureComponent<Props<T>, State<T>> {
  public static defaultProps = { initialSelectedKeys: [], items: [] };

  public state: State<T> = {
    selectedKeys: this.props.initialSelectedKeys,
    items: [],
    keys: [],
    getItemKey: this.props.getItemKey,
    renderItem: this.props.renderItem,
    children: this.props.children,
    renderEmptyState: this.props.renderEmptyState,
    hoveredKey: null,
  };

  public static getDerivedStateFromProps<T>(
    props: Props<T>,
    previousState: State<T>,
  ): State<T> | null {
    const { renderItem, renderEmptyState, getItemKey, items, children } = props;

    let state = previousState;

    if (state.items !== items || state.getItemKey !== getItemKey) {
      const keys = props.items.map((item) => getItemKey(item));
      const selectedKeys = arrayIntersect(state.selectedKeys, keys);
      state = { ...state, selectedKeys, items, keys, getItemKey };
    }

    if (state.renderItem !== renderItem) {
      state = { ...state, renderItem };
    }

    if (state.children !== children) {
      state = { ...state, children };
    }

    if (state.renderEmptyState !== renderEmptyState) {
      state = { ...state, renderEmptyState };
    }

    if (state === previousState) {
      return null;
    }

    return state;
  }

  public setItemSelected = (item: T, itemSelected: boolean) => {
    this.setState((state) => {
      const key = state.getItemKey(item);
      return setKeySelected(key, itemSelected)(state);
    });
  };

  public setKeySelected = (key: string, keySelected: boolean) => {
    this.setState(setKeySelected(key, keySelected));
  };

  public setSelectedItems = (selectedItems: T[]) => {
    this.setState((state) => {
      const keys = selectedItems.map(state.getItemKey);
      return setSelectedKeys(keys)(state);
    });
  };

  public setSelectedKeys = (selectedKeys: string[]) => {
    this.setState(setSelectedKeys(selectedKeys));
  };

  // TODO: `setHovered` is unnecessarily tightly coupled to the HoverController
  // component. Fix it to use a boolean argument instead of an object
  public setHovered = (key: string) => (ev: { hovered: boolean }) => {
    this.setState((state) => {
      if (ev.hovered === true) {
        if (state.hoveredKey !== key) {
          return { hoveredKey: key };
        }
      } else if (state.hoveredKey === key) {
        return { hoveredKey: null };
      }
      return null;
    });
  };

  public render() {
    const {
      items,
      keys,
      selectedKeys,
      renderItem,
      children,
      renderEmptyState,
    } = this.state;

    return children({
      children: items.length
        ? items.map((item, i) => {
            const key = keys[i];
            const selected = selectedKeys.includes(key);

            return renderItem({
              key,
              item,
              selected,
              setSelected: (keySelected) =>
                this.setKeySelected(key, keySelected),
              hovered: this.state.hoveredKey === key,
              setHovered: this.setHovered(key),
              selectedCount: selectedKeys.length,
              toggleSelected: () => this.setKeySelected(key, !selected),
            });
          })
        : renderEmptyState(),
      keys,
      selectedKeys,
      selectedItems: items.filter((item, i) => {
        const key = keys[i];
        return selectedKeys.includes(key);
      }),
      setKeySelected: this.setKeySelected,
      setItemSelected: this.setItemSelected,
      setSelectedKeys: this.setSelectedKeys,
      setSelectedItems: this.setSelectedItems,
      toggleSelectedItems: () =>
        selectedKeys.length === 0
          ? this.setSelectedKeys(keys)
          : this.setSelectedKeys([]),
    });
  }
}

export default ListController;
