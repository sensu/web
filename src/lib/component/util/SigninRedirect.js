import React from "/vendor/react";
import { Route, Redirect } from "/vendor/react-router-dom";
import { SearchParamKey } from "/lib/constant";

const signinPath = "/signin";

class SigninRedirect extends React.PureComponent {
  renderRedirect = ({ location }) => {
    let queryParams = location.search || "?";

    // Add next path
    if (location.pathname !== signinPath) {
      const newQuery = new URLSearchParams(queryParams);
      newQuery.set(
        SearchParamKey.redirect,
        location.pathname + location.search,
      );
      queryParams = `?${newQuery.toString()}`;
    }

    return <Redirect to={`${signinPath}${queryParams}`} />;
  };

  render() {
    return <Route render={this.renderRedirect} />;
  }
}

export default SigninRedirect;
