import React from "/vendor/react";
import { Link, makeStyles, createStyles } from "/vendor/@material-ui/core";
import { LinkIcon } from "/lib/component/icon";

const useStyles = makeStyles(() => createStyles({
  iconFix: {
    verticalAlign: "text-bottom",
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
    <Link href={value}>
      <span className={classes.iconFix}>
        <LinkIcon fontSize="inherit" />
        {" "}
      </span>
      <span className={classes.iconFix}>{value}</span>
    </Link>
  );
};

export default AutoLink;
