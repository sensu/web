import React from "/vendor/react";
import PropTypes from "prop-types";
import { withStyles, Box, Typography, Grid } from "/vendor/@material-ui/core";
import Lizy from "/lib/component/base/Lizy";

const styles = theme => ({
  root: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  headline: {
    ...theme.typography.monospace,
    fontSize: 104,
    fontWeight: 800,
  },
  body: {
    maxWidth: "65ch",
    "& a": {
      textDecoration: "underline",
    },
    "& a:visited": {
      color: "inherit",
    },
    "& a:link": {
      color: "inherit",
    },
  },
  graphic: {
    margin: theme.spacing(-12, 0),
  },
  [theme.breakpoints.up("sm")]: {
    root: {
      textAlign: "left",
    },
    graphic: {
      margin: 0,
      textAlign: "right",
    },
  },
});

class NotFound extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: (
      <React.Fragment>
        The page you requested was not found.{" "}
        <a href="#back" onClick={() => window.history.back()}>
          Go back
        </a>{" "}
        or <a href="/">return home</a>.
      </React.Fragment>
    ),
  };

  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} className={classes.graphic}>
            <Box
              component={Lizy}
              variant="idle"
              height="36vh"
            />
          </Grid>
          <Box
            component={Grid}
            item
            xs={12}
            sm={6}
            display="flex"
            justifyContent="center"
            flexDirection="column"
          >
            <Typography
              className={classes.headline}
              variant="h1"
              color="textPrimary"
            >
              404
            </Typography>
            <Typography
              className={classes.body}
              variant="body2"
              color="textSecondary"
            >
              {children}
            </Typography>
          </Box>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(NotFound);
