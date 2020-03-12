import React from "/vendor/react";
import { Link, makeStyles, createStyles, Typography } from "/vendor/@material-ui/core";
import { LinkIcon } from "/lib/component/icon";

const useStyles = makeStyles(() => createStyles({
  iconFix: {
    verticalAlign: "text-top",
  },
}))

interface Props extends React.HTMLProps<HTMLSpanElement> {
  value: string;
}

const AutoLink = ({ value, ...props}: Props) => {
  const classes = useStyles();

  try {
    new URL(value);
  } catch (e) {
    return <span {...props}>{value}</span>;
  }
  return (
    <Link href={value} target="blank" rel="noreferrer">
      <Typography component="span" variant="body2" className={classes.iconFix}>
        <LinkIcon fontSize="inherit" />
        {" "}
      </Typography>
      <span>{value}</span>
    </Link>
  );
};

export default AutoLink;
