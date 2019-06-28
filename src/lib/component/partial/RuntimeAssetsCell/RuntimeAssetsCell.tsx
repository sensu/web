import React from "/vendor/react";
import gql from "/vendor/graphql-tag";

import { Grid, CardContent } from "/vendor/@material-ui/core";

import {
  Dictionary,
  DictionaryKey,
  DictionaryValue,
  DictionaryEntry,
  CodeBlock,
  CodeHighlight,
} from "/lib/component/base";

export interface RuntimeAsset {
  name: string;
}

interface Props {
  runtimeAssets: RuntimeAsset[];
}

const RuntimeAssetsCell = ({ runtimeAssets }: Props) => {
  return (
    <CardContent>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Dictionary>
            <DictionaryEntry fullWidth={!!runtimeAssets}>
              <DictionaryKey>Runtime Assets</DictionaryKey>
              <DictionaryValue>
                {runtimeAssets && runtimeAssets.length > 0 ? (
                  <CodeBlock>
                    <CodeHighlight
                      language="properties"
                      code={runtimeAssets.map(({ name }) => name).join("\n")}
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
};

RuntimeAssetsCell.fragments = {
  assets: gql`
    fragment RuntimeAssetsCell_assets on Asset {
      name
    }
  `,
};

export default RuntimeAssetsCell;
