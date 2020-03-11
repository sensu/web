import React from "/vendor/react";
import { Link, withStyles } from "/vendor/@material-ui/core";
import { LinkIcon } from "/lib/component/icon";

const styles = () => ({
  iconFix: {
    verticalAlign: "text-bottom",
  },
});

interface Props extends React.HTMLProps<HTMLSpanElement> {
  value: string;
  classes: object;
}

const AutoLink = ({ value, classes, ...props}: Props) => {
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

export default withStyles(styles)(AutoLink);
