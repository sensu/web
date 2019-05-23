import handle from "/lib/exceptionHandler";

import React from "/vendor/react";
import ReactDOM from "/vendor/react-dom";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "/vendor/react-router-dom";

// eslint-disable-next-line import/extensions
import "typeface-roboto";

import polyfill from "/lib/polyfill";
import { unregisterAll } from "/lib/util/serviceWorker";

import {
  ErrorBoundary,
  LastNamespaceRedirect,
  NamespaceRoute,
  NavigationProvider,
} from "/lib/component/util";

import {
  CheckIcon,
  EntityIcon,
  EventIcon,
  HandlerIcon,
  SilenceIcon,
} from "/lib/component/icon";

import { AppRoot } from "/lib/component/root";

import {
  ChecksView,
  EntitiesView,
  EventsView,
  HandlersView,
  SilencesView,
  NotFoundView,
  CheckDetailsView,
  EventDetailsView,
  EntityDetailsView,
  NamespaceNotFoundView,
} from "/lib/component/view";

import createClient from "/app/apollo/client";

const updateServiceWorker = () => () =>
  // Unregister previous service worker scripts since the app does not
  // currently provide one.
  unregisterAll().catch(error => {
    // eslint-disable-next-line no-console
    console.warn("Service worker unregistration failed.");
    // eslint-disable-next-line no-console
    console.warn(error);
  });

const renderApp = () => {
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
                <NavigationProvider
                  links={[
                    {
                      to: `${props.match.url}/events`,
                      icon: EventIcon,
                      caption: "Events",
                    },
                    {
                      to: `${props.match.url}/entities`,
                      icon: EntityIcon,
                      caption: "Entities",
                    },
                    {
                      to: `${props.match.url}/checks`,
                      icon: CheckIcon,
                      caption: "Checks",
                    },
                    {
                      to: `${props.match.url}/handlers`,
                      icon: HandlerIcon,
                      caption: "Handlers",
                    },
                    {
                      to: `${props.match.url}/silences`,
                      icon: SilenceIcon,
                      caption: "Silences",
                    },
                  ]}
                >
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
                      path={`${props.match.path}/handlers`}
                      component={HandlersView}
                    />
                    <Route
                      path={`${props.match.path}/silences`}
                      component={SilencesView}
                    />
                    <Route render={() => "not found in namespace"} />
                  </Switch>
                </NavigationProvider>
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
};

polyfill()
  .then(updateServiceWorker)
  .then(renderApp);
