import handle from "/lib/exceptionHandler";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import injectTapEventPlugin from "react-tap-event-plugin";

// eslint-disable-next-line import/extensions
import "typeface-roboto";

import polyfill from "/lib/polyfill";

import {
  ErrorBoundary,
  LastNamespaceRedirect,
  NamespaceRoute,
} from "/lib/component/util";

import { AppRoot } from "/lib/component/root";

import {
  ChecksView,
  EntitiesView,
  EventsView,
  SilencesView,
  NotFoundView,
  CheckDetailsView,
  EventDetailsView,
  EntityDetailsView,
  NamespaceNotFoundView,
} from "/lib/component/view";

import createClient from "/app/apollo/client";

polyfill().then(() => {
  const client = createClient();

  // Renderer
  ReactDOM.render(
    <ErrorBoundary handle={handle}>
      <BrowserRouter>
        <AppRoot apolloClient={client}>
          <Switch>
            <Route exact path="/" component={LastNamespaceRedirect} />
            <NamespaceRoute
              path="/:namespace"
              render={props => (
                <Switch>
                  <Redirect
                    exact
                    from={props.match.path}
                    to={`${props.match.path}/events`}
                  />
                  <Route
                    path={`${props.match.path}/checks/:check`}
                    component={CheckDetailsView}
                  />
                  <Route
                    path={`${props.match.path}/events/:entity/:check`}
                    component={EventDetailsView}
                  />
                  <Route
                    path={`${props.match.path}/entities/:entity`}
                    component={EntityDetailsView}
                  />
                  <Route
                    path={`${props.match.path}/checks`}
                    component={ChecksView}
                  />
                  <Route
                    path={`${props.match.path}/entities`}
                    component={EntitiesView}
                  />
                  <Route
                    path={`${props.match.path}/events`}
                    component={EventsView}
                  />
                  <Route
                    path={`${props.match.path}/silences`}
                    component={SilencesView}
                  />
                  <Route render={() => "not found in namespace"} />
                </Switch>
              )}
              fallbackComponent={NamespaceNotFoundView}
            />
            <Route component={NotFoundView} />
          </Switch>
        </AppRoot>
      </BrowserRouter>
    </ErrorBoundary>,
    document.getElementById("root"),
  );
});

// Register React Tap event plugin
injectTapEventPlugin();
