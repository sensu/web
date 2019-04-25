import React from "/vendor/react";
import PropTypes from "prop-types";
import { ApolloProvider } from "/vendor/react-apollo";
import { Switch, withRouter } from "/vendor/react-router-dom";

import compose from "/lib/util/compose";

import {
  AppThemeProvider,
  ResetStyles,
  ThemeStyles,
} from "/lib/component/base";

import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
  AuthInvalidRoute,
  LastNamespaceRedirect,
  SigninRedirect,
} from "/lib/component/util";

import { RelocationProvider } from "/lib/component/relocation";

import { SignInView } from "/lib/component/view";

import { AuthInvalidDialog, GlobalAlert } from "/lib/component/partial";

class AppRoot extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    apolloClient: PropTypes.object.isRequired,
  };

  render() {
    const { apolloClient, children } = this.props;

    return (
      <RelocationProvider>
        <ApolloProvider client={apolloClient}>
          <AppThemeProvider>
            <Switch>
              <UnauthenticatedRoute
                exact
                path="/signin"
                component={SignInView}
                fallbackComponent={LastNamespaceRedirect}
              />

              <AuthenticatedRoute
                render={() => children}
                fallbackComponent={SigninRedirect}
              />
            </Switch>
            <Switch>
              <UnauthenticatedRoute exact path="/signin" />
              <AuthInvalidRoute component={AuthInvalidDialog} />
            </Switch>
            <ResetStyles />
            <ThemeStyles />
            <GlobalAlert />
          </AppThemeProvider>
        </ApolloProvider>
      </RelocationProvider>
    );
  }
}

// AppRoot is composed with `withRouter` here to prevent "Update Blocking"
// see: reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default compose(withRouter)(AppRoot);
