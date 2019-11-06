import { ListSubheader, Theme, styled } from "/vendor/@material-ui/core";
import { fade } from "/vendor/@material-ui/core/styles/colorManipulator";

const ContextSwitcherListHeader = styled(ListSubheader)<Theme>(
  ({ theme }) => ({
    backgroundColor: fade(theme.palette.background.paper, 0.5),
    backdropFilter: "blur(8px)",
    lineHeight: `${theme.spacing(4)}px`,
  }),
  { name: "ContextSwitcherListHeader" },
);

export default ContextSwitcherListHeader;
