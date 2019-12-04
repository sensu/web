import React from "/vendor/react";
import PropTypes from "prop-types";
import gql from "/vendor/graphql-tag";

import { Grid } from "/vendor/@material-ui/core";

import {
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
  CodeBlock,
  CodeHighlight,
} from "/lib/component/base";
import { createStyledComponent, Maybe } from "/lib/component/util";

import Label from "/lib/component/partial/Label";

const Key = createStyledComponent({
  name: "LabelsAnnotationsCell.Key",
  component: DictionaryKey,
  styles: () => ({
    width: "25%",
  }),
});

const Value = createStyledComponent({
  name: "LabelsAnnotationsCell.Value",
  component: DictionaryValue,
  styles: () => ({
    width: "100%",
  }),
});

class LabelsAnnotationsCell extends React.PureComponent {
  static propTypes = {
    resource: PropTypes.object.isRequired,
  };

  static defaultProps = {
    resource: null,
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
    const { resource } = this.props;

    const annotations = resource.metadata.annotations.reduce((anno, kvPair) => {
      let value;
      try {
        value = JSON.parse(kvPair.val);
      } catch (e) {
        value = kvPair.val;
      }
      return { ...anno, [kvPair.key]: value };
    }, {});

    return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12}>
          <Dictionary>
            <DictionaryEntry>
              <Key>Labels</Key>
              <Value explicitRightMargin>
                <Maybe value={resource.metadata.labels} fallback="None">
                  {val =>
                    val.map(pair => [
                      <Label key={pair.key} name={pair.key} value={pair.val} />,
                      " ",
                    ])
                  }
                </Maybe>
              </Value>
            </DictionaryEntry>
          </Dictionary>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Dictionary>
            <DictionaryEntry>
              <Key>Annotations</Key>
              <Value explicitRightMargin>
                {resource.metadata.annotations.length > 0 ? (
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
              </Value>
            </DictionaryEntry>
          </Dictionary>
        </Grid>
      </Grid>
    );
  }
}

export default LabelsAnnotationsCell;
