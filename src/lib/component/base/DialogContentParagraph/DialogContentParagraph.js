import { withStyles, DialogContentText } from "/vendor/@material-ui/core";

const StyledDialogContentText = withStyles(() => ({
  root: { marginBottom: "2rem" },
}))(DialogContentText);

export default StyledDialogContentText;
