import { useMediaQuery, useTheme } from "/vendor/@material-ui/core";

const useBreakpoint = (
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl",
  dir: "gt" | "lt" = "gt",
): boolean => {
  const theme = useTheme();
  const query =
    dir === "gt"
      ? theme.breakpoints.up(breakpoint)
      : theme.breakpoints.down(breakpoint);

  return useMediaQuery(query, { noSsr: true });
};

export default useBreakpoint;
