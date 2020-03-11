import React from "/vendor/react";
import PropTypes from "prop-types";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  withStyles,
} from "/vendor/@material-ui/core";
import { OpenInNewIcon } from "/lib/component/icon";
import { ModalController } from "/lib/component/controller";
import { CodeBlock, CodeHighlight } from "/lib/component/base";
import { Label } from "/lib/component/partial";

const styles = () => ({
  iconFix: {
    verticalAlign: "text-top",
  },
});

// TODO: make all labels clickable

class Annotation extends React.Component {
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
              <Dialog open maxWidth TransitionComponent={Slide} onClose={close}>
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
                  <Button onClick={close} color="contrast">
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          >
            {({ open }) => (
              <React.Fragment>
                <Label
                  name={
                    <React.Fragment>
                      <span>{key}</span>
                    </React.Fragment>
                  }
                  value={
                    typeof children[key] === "object" ? (
                      <span className={classes.iconFix}>
                        <OpenInNewIcon fontSize="inherit" />
                      </span>
                    ) : (
                      children[key]
                    )
                  }
                  onClick={open}
                />{" "}
              </React.Fragment>
            )}
          </ModalController>
        </React.Fragment>
      );
    });
    return annos;
  }
}

export default withStyles(styles)(Annotation);
