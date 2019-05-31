import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { withStyles, Grid, CardContent } from "/vendor/@material-ui/core";

import {
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
  CodeBlock,
  CodeHighlight,
} from "/lib/component/base";
import { Maybe } from "/lib/component/util";

import Label from "/lib/component/partial/Label";

const styles = () => ({
  override: {
    width: "25%",
  },
  fullWidth: {
    width: "100%",
  },
});

class LabelsAnnotationsCell extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    entity: PropTypes.object,
    check: PropTypes.object,
    handler: PropTypes.object,
  };

  static defaultProps = {
    entity: null,
    check: null,
    handler: null,
  };

  static fragments = {
    objectmeta: gql`
      fragment LabelsAnnotationsCell_objectmeta on ObjectMeta {
        labels {
          key
          val
        }
        annotations {
          key
          val
        }
      }
    `,
  };

  render() {
    const { check, classes, entity, handler } = this.props;

    const object = check || entity || handler;

    const annotations = Object.keys(object.metadata.annotations).reduce(
      (anno, key) => {
        try {
          // eslint-disable-next-line
          anno[object.metadata.annotations[key].key] = JSON.parse(
            object.metadata.annotations[key].val,
          );
        } catch (e) {
          // eslint-disable-next-line
          anno[object.metadata.annotations[key].key] =
            object.metadata.annotations[key].val;
        }
        return anno;
      },
      {},
    );

    return (
      <CardContent>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12}>
            <Dictionary>
              <DictionaryEntry>
                <DictionaryKey className={classes.override}>
                  Labels
                </DictionaryKey>
                <DictionaryValue explicitRightMargin>
                  <Maybe value={object.metadata.labels} fallback="None">
                    {val =>
                      val.map(pair => [
                        <Label
                          key={pair.key}
                          name={pair.key}
                          value={pair.val}
                        />,
                        " ",
                      ])
                    }
                  </Maybe>
                </DictionaryValue>
              </DictionaryEntry>
            </Dictionary>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Dictionary>
              <DictionaryEntry>
                <DictionaryKey className={classes.override}>
                  Annotations
                </DictionaryKey>
                <DictionaryValue className={classes.fullWidth}>
                  {object.metadata.annotations.length > 0 ? (
                    <CodeBlock>
                      <CodeHighlight
                        language="json"
                        code={JSON.stringify(annotations, null, "\t")}
                        component="code"
                      />
                    </CodeBlock>
                  ) : (
                    "None"
                  )}
                </DictionaryValue>
              </DictionaryEntry>
            </Dictionary>
          </Grid>
        </Grid>
      </CardContent>
    );
  }
}

export default withStyles(styles)(LabelsAnnotationsCell);
