import React from "/vendor/react";
import {
  Link,
  makeStyles,
  createStyles,
  Typography,
} from "/vendor/@material-ui/core";
import { LinkIcon } from "/lib/component/icon";
import newURL, { URLToString } from "/lib/util/url";

const useStyles = makeStyles(() =>
  createStyles({
    iconFix: {
      verticalAlign: "text-top",
    },
  }),
);

interface Props extends React.HTMLProps<HTMLSpanElement> {
  value: string;
}

const AutoLink = ({ value, ...props }: Props) => {
  const classes = useStyles();
  const url = React.useMemo(() => {
    try {
      const parsedUrl = newURL(value);
      return URLToString(parsedUrl);
    } catch (e) {
      return "";
    }
  }, [value]);

  if (!url) {
    return <span {...props}>{value}</span>;
  }
  return (
    <Link href={value} target="blank" rel="noreferrer">
      <Typography component="span" variant="body2" className={classes.iconFix}>
        <LinkIcon fontSize="inherit" />{" "}
      </Typography>
      <span>{value}</span>
    </Link>
  );
};

export default React.memo(AutoLink);
