import React from "/vendor/react";

import { SearchIcon, FilterIcon } from "/lib/component/icon";
import { makeStyles, createStyles, Theme } from "/vendor/@material-ui/core";
import { Box, Typography } from "/vendor/@material-ui/core";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      input: {
        flex: "1 0 auto",
        height: 48,
        backgroundColor: "inherit",
        border: "none",
        "&:focus": {
          outline: "none",
        },
        "&::placeholder": {
          color: theme.palette.text.hint,
        },
      },
    }),
  { name: "SearchBox" },
);

const icons = {
  search: SearchIcon,
  filter: FilterIcon,
};

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  variant?: "search" | "filter";
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBox = ({
  variant = "search",
  value = "",
  placeholder = "",
  onChange = () => null,
  ...props
}: Props) => {
  const classes = useStyles();
  const Icon = icons[variant];

  return (
    <Box clone display="flex" pr={1 / 2}>
      <Typography component="div">
        <Box display="inline-flex" flexGrow="0" p={3 / 2}>
          <Box component="span" display="flex" justifyContent="center">
            <Icon />
          </Box>
        </Box>

        <input
          type="search"
          className={classes.input}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </Typography>
    </Box>
  );
};

export default SearchBox;
