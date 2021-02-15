import React from "react";

import { defaultRenderSuggestion } from "/lib/component/base/AutoSuggest";
import Autosuggest from "react-autosuggest";
import Divider from "@material-ui/core/Divider";
import Input from "@material-ui/core/InputBase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

import useAutosuggest from "/lib/component/util/useAutosuggest";

interface Props {
  anchorEl?: Element;

  open?: boolean;
  onChange?: (_: string) => void;
  onClose?: () => void;

  resourceType?: React.ReactNode;
  namespace: string;
  objRef: string;
  order?: "ALPHA_DESC" | "ALPHA_ASC" | "FREQUENCY";
  limit?: number;
  delay?: number;
}

const AutosuggestionSelectMenu: React.FC<Props> = ({
  anchorEl,
  open = true,
  onChange = () => false,
  onClose = () => false,

  resourceType = "resources",
  namespace,
  objRef,
  order = "ALPHA_DESC",
  limit = 20,
  delay = 350,
}) => {
  const [filter, setFilter] = React.useState("");

  const suggestions = useAutosuggest({
    namespace,
    ref: objRef,
    order,
    limit,
    q: filter,
    delay,
  });

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        style: {
          minWidth: 320,
          maxWidth: 480,
          maxHeight: 480,
        },
      }}
    >
      <List>
        <Autosuggest
          alwaysRenderSuggestions
          focusInputOnSuggestionClick
          getSuggestionValue={(suggestion: string) => suggestion}
          inputProps={{
            autoFocus: true,
            placeholder: `filter ${resourceType}`,
            onChange: (ev) => {
              ev.preventDefault();
              setFilter(ev.currentTarget.value || "");
            },
            value: filter,
          }}
          onSuggestionsFetchRequested={() => true}
          onSuggestionSelected={(_: any, { suggestion }: any) => {
            onChange(suggestion);
            onClose();
          }}
          renderInputComponent={(props: any) => (
            <ListItem>
              <Input fullWidth {...props} />
            </ListItem>
          )}
          renderSuggestionsContainer={({ containerProps, children }) => (
            <div {...containerProps}>
              <Divider />
              {children ? (
                children
              ) : (
                <ListItem>
                  <Typography color="textSecondary">
                    No {resourceType} found.
                  </Typography>
                </ListItem>
              )}
            </div>
          )}
          renderSuggestion={defaultRenderSuggestion}
          shouldRenderSuggestions={() => true}
          suggestions={suggestions}
        />
      </List>
    </Popover>
  );
};

export default AutosuggestionSelectMenu;
