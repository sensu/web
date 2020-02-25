import React from "/vendor/react";
import cx from "/vendor/classnames";

import {
  makeStyles,
  createStyles,
  Theme,
  Typography,
} from "/vendor/@material-ui/core";

import useReqContext from "/lib/component/util/useReqContext";
import { InlineLink } from "/lib/component/base";
import { useRouter, NamespaceLink } from "/lib/component/util";

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {},
      list: {
        width: "100%",
        textDecoration: "none",
      },
      listItem: {
        display: "inline",
        opacity: 0.71,
        marginRight: theme.spacing(1.5),
      },
      active: {
        opacity: 1,
      },
      separator: {
        opacity: 0.5,
      },
    }),
  { name: "Breadcrumbs" },
);

const Separator = () => {
  const classes = useStyles();

  return <li className={cx(classes.listItem, classes.separator)}>›</li>;
};

interface CrumbProps {
  children: React.ReactElement | string;
  active?: boolean;
}

const Crumb = ({ children, active = false }: CrumbProps) => {
  const classes = useStyles();

  return (
    <li className={cx(classes.listItem, { [classes.active]: active })}>
      {children}
    </li>
  );
};

const Breadcrumbs = () => {
  const classes = useStyles();

  const { namespace, cluster } = useReqContext();

  const router = useRouter();
  const paths = router.location.pathname.split("/");
  const resource = paths[paths.indexOf(namespace) + 1] || "";
  const resourceNames = paths.slice(paths.indexOf(namespace) + 2);

  return (
    <Typography
      component="div"
      className={classes.root}
      noWrap
      color="textPrimary"
      variant="body2"
    >
      <ul className={classes.list}>
        {cluster && (
          <React.Fragment>
            <Crumb>
              <NamespaceLink
                component={InlineLink}
                cluster={cluster}
                namespace={namespace}
                to={"/"}
              >
                {cluster === "~" ? "local-cluster" : cluster}
              </NamespaceLink>
            </Crumb>

            <Separator />
          </React.Fragment>
        )}

        <Crumb>
          <NamespaceLink component={InlineLink} namespace={namespace} to={"/"}>
            {namespace}
          </NamespaceLink>
        </Crumb>

        <Separator />

        <Crumb active={resourceNames.length === 0}>
          {resourceNames.length > 0 ? (
            <NamespaceLink
              component={InlineLink}
              namespace={namespace}
              to={`/${resource}`}
            >
              {resource}
            </NamespaceLink>
          ) : (
            resource
          )}
        </Crumb>

        {resourceNames.map((name) => (
          <React.Fragment key={name}>
            <Separator />

            <Crumb active>{name}</Crumb>
          </React.Fragment>
        ))}
      </ul>
    </Typography>
  );
};

export default Breadcrumbs;
