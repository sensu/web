import React from "/vendor/react";
import {
  Theme,
  makeStyles,
  createStyles,
  Typography,
} from "/vendor/@material-ui/core";
import { KeyboardArrowRightIcon } from "/lib/component/icon";
import useReqContext from "/lib/component/util/useReqContext";

import { useRouter, NamespaceLink } from "/lib/component/util";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: "16px",
      maxWidth: "950px",
    },
    text: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    list: {
      width: "100%",
      textDecoration: "none",
    },
    listItem: {
      display: "inline",
      marginRight: "16px",
      color: theme.palette.text.primary,
    },
    iconOffset: {
      marginBottom: "-7px",
    },
    link: {
      color: theme.palette.text.primary,
    },
  }),
);

const Breadcrumbs = () => {
  const classes = useStyles();
  const router = useRouter();
  const { namespace, cluster } = useReqContext();
  const links = router.location.pathname.split("/");
  const placement = links.indexOf(namespace) + 1;
  const url = `/${links[placement]}`;

  return (
    <div className={classes.root}>
      <Typography className={classes.text} variant="body1">
        <ul>
          {cluster && (
            <React.Fragment>
              <li className={classes.listItem}>
                <NamespaceLink
                  cluster={cluster}
                  namespace={namespace}
                  className={classes.link}
                  to={"/"}
                >
                  {cluster === "~" ? "local-cluster" : cluster}
                </NamespaceLink>
              </li>

              <li className={classes.listItem}>
                <KeyboardArrowRightIcon className={classes.iconOffset} />
              </li>
            </React.Fragment>
          )}

          <li className={classes.listItem}>
            <NamespaceLink
              namespace={namespace}
              className={classes.link}
              to={"/"}
            >
              {namespace}
            </NamespaceLink>
          </li>

          <li className={classes.listItem}>
            <KeyboardArrowRightIcon className={classes.iconOffset} />
          </li>

          <li className={classes.listItem}>
            <NamespaceLink
              namespace={namespace}
              className={classes.link}
              to={url}
            >
              {links[placement]}
            </NamespaceLink>
          </li>
        </ul>
      </Typography>
    </div>
  );
};

export default Breadcrumbs;
