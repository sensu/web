import { ListSubheader, Theme, styled } from "/vendor/@material-ui/core";
import { fade } from "/vendor/@material-ui/core/styles/colorManipulator";

const ContextSwitcherListHeader = styled(ListSubheader)<Theme>(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    lineHeight: `${theme.spacing(4)}px`,
    "@supports (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px))": {
      backgroundColor: fade(theme.palette.background.paper, 0.5),
      backdropFilter: `blur(${theme.spacing(1)}px)`,
    },
  }),
  { name: "ContextSwitcherListHeader" },
);

export default ContextSwitcherListHeader;
