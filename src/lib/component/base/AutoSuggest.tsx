import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import ReactAutosuggest, {
  AutosuggestProps as ReactAutosuggestProps,
} from "react-autosuggest";

interface RenderSuggestionOpts<T> {
  query: string;
  isHighlighted: boolean;
}

export function defaultRenderSuggestion<T>(
  suggestion: T,
  { query, isHighlighted }: RenderSuggestionOpts<T>,
) {
  const matches = match(suggestion as any, query);
  const parts = parse(suggestion as any, matches);

  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      onMouseDown={(e: any) => e.preventDefault()} // prevent the click causing the input to be blurred
    >
      <div>
        {parts.map((part, idx) => {
          return part.highlight ? (
            <span key={String(idx)} style={{ fontWeight: 800 }}>
              {part.text}
            </span>
          ) : (
            <React.Fragment key={String(idx)}>{part.text}</React.Fragment>
          );
        })}
      </div>
    </MenuItem>
  );
}

interface AutosuggestDefeaultRenderSuggestionsContainerProps {
  containerProps: any;
  children: React.ReactNode;
}

export const defaultRenderSuggestionsContainer = ({
  containerProps,
  children,
}: AutosuggestDefeaultRenderSuggestionsContainerProps) => {
  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};

const useStyles = makeStyles(
  (theme) => ({
    container: {
      flexGrow: 1,
      position: "relative",
      width: "100%",
      //marginRight: theme.spacing(),
    },
    suggestionsContainerOpen: {
      position: "absolute",
      marginTop: theme.spacing(),
      marginBottom: theme.spacing(3),
      left: 0,
      right: 0,
      zIndex: theme.zIndex.appBar,
    },
    suggestion: {
      display: "block",
    },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: "none",
    },
    textField: {
      width: "100%",
    },
  }),
  {
    name: "Autosuggest",
  },
);

interface AutoSuggestPropsBase {
  forwardRef: React.Ref<any>;
}

type AutosuggestProps<V, S> = ReactAutosuggestProps<V, S> &
  AutoSuggestPropsBase;

const Autosuggest = <V, S>({
  onSuggestionsClearRequested = () => {},
  renderSuggestion = defaultRenderSuggestion,
  renderSuggestionsContainer = defaultRenderSuggestionsContainer,
  forwardRef,
  ...props
}: AutosuggestProps<V, S>) => {
  const classes = useStyles();

  return (
    <ReactAutosuggest
      theme={classes}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      renderSuggestion={renderSuggestion}
      renderSuggestionsContainer={renderSuggestionsContainer}
      {...props}
      ref={forwardRef}
    />
  );
};

// eslint-disable-next-line react/display-name
export default React.forwardRef((props: any, ref: React.Ref<any>) => (
  <Autosuggest forwardRef={ref} {...props} />
));
