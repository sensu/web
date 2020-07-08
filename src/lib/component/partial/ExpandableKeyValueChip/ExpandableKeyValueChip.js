import React from "/vendor/react";
import PropTypes from "prop-types";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Typography,
  withStyles,
} from "/vendor/@material-ui/core";
import { OpenInNewIcon } from "/lib/component/icon";
import { ModalController } from "/lib/component/controller";
import { CodeBlock, CodeHighlight } from "/lib/component/base";
import KeyValueChip from "/lib/component/partial/KeyValueChip";

const styles = () => ({
  iconFix: {
    verticalAlign: "text-top",
  },
  hover: {
    "&:hover": {
      cursor: "pointer",
    },
  },
});

// eslint-disable-next-line react/prop-types
const JSONValue = ({ object }) => {
  const str = JSON.stringify(object);

  return (
    <React.Fragment>
      {str.length > 7 ? str.slice(0, 7) + "..." : "JSON"}{" "}
      <OpenInNewIcon fontSize="inherit" />
    </React.Fragment>
  );
};

class ExpandableKeyValueChip extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { children, classes } = this.props;

    const annos = Object.keys(children).map(key => {
      return (
        <React.Fragment key={key}>
          <ModalController
            renderModal={({ close }) => (
              <Dialog
                open
                maxWidth="sm"
                fullWidth
                TransitionComponent={Slide}
                onClose={close}
              >
                <DialogTitle>{key}</DialogTitle>
                <DialogContent>
                  <CodeBlock>
                    <CodeHighlight
                      language="json"
                      component="code"
                      code={JSON.stringify(children[key], null, "\t")}
                    />
                  </CodeBlock>
                </DialogContent>
                <DialogActions>
                  <Button onClick={close}>Close</Button>
                </DialogActions>
              </Dialog>
            )}
          >
            {({ open }) => (
              <span className={classes.hover}>
                <KeyValueChip
                  name={
                    <React.Fragment>
                      <span>{key}</span>
                    </React.Fragment>
                  }
                  value={
                    typeof children[key] === "object" ? (
                      <Typography
                        component="span"
                        variant="body2"
                        className={classes.iconFix}
                      >
                        <JSONValue object={children[key]} />
                      </Typography>
                    ) : (
                      children[key].toString() || "[empty]"
                    )
                  }
                  onClick={open}
                />{" "}
              </span>
            )}
          </ModalController>
        </React.Fragment>
      );
    });
    return annos;
  }
}

export default withStyles(styles)(ExpandableKeyValueChip);
