import withWidth from "/vendor/@material-ui/core/withWidth";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

interface Props {
  width: Breakpoint;
  children(props: { width: Breakpoint }): JSX.Element | null;
}

export default withWidth()(
  ({ width, children }: Props): JSX.Element | null => children({ width }),
);
