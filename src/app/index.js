import handle from "/lib/exceptionHandler";

import React from "/vendor/react";
import ReactDOM from "/vendor/react-dom";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "/vendor/react-router-dom";

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
  EventFilterIcon,
  HandlerIcon,
  MutatorIcon,
  SilenceIcon,
} from "/lib/component/icon";

import { AppRoot } from "/lib/component/root";

import {
  ChecksView,
  EntitiesView,
  EventsView,
  EventFiltersView,
  HandlersView,
  SilencesView,
  NotFoundView,
  CheckDetailsView,
  EventDetailsView,
  EventFilterDetailsView,
  EntityDetailsView,
  HandlerDetailsView,
  MutatorsView,
  MutatorDetailsView,
  NamespaceNotFoundView,
} from "/lib/component/view";

import {
  ContextSwitcherKeybinding,
  PreferencesKeybinding,
} from "/lib/component/keybind";

import { ContextSwitcherDialog } from "/lib/component/partial";

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
              path="/n/:namespace"
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
                      to: `${props.match.url}/filters`,
                      icon: EventFilterIcon,
                      caption: "Filters",
                    },
                    {
                      to: `${props.match.url}/handlers`,
                      icon: HandlerIcon,
                      caption: "Handlers",
                    },
                    {
                      to: `${props.match.url}/mutators`,
                      icon: MutatorIcon,
                      caption: "Mutators",
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
                      path={`${props.match.path}/filters/:filter`}
                      component={EventFilterDetailsView}
                    />
                    <Route
                      path={`${props.match.path}/entities/:entity`}
                      component={EntityDetailsView}
                    />
                    <Route
                      path={`${props.match.path}/handlers/:handler`}
                      component={HandlerDetailsView}
                    />
                    <Route
                      path={`${props.match.path}/mutators/:mutator`}
                      component={MutatorDetailsView}
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
                      path={`${props.match.path}/filters`}
                      component={EventFiltersView}
                    />
                    <Route
                      path={`${props.match.path}/handlers`}
                      component={HandlersView}
                    />
                    <Route
                      path={`${props.match.path}/mutators`}
                      component={MutatorsView}
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
            {/* backward compat */}
            <Redirect exact from="/:namespace/home" to="/n/:namespace/home" />
            <Redirect from="/:namespace/checks" to="/n/:namespace/checks" />
            <Redirect from="/:namespace/entities" to="/n/:namespace/entities" />
            <Redirect from="/:namespace/events" to="/n/:namespace/events" />
            <Redirect from="/:namespace/filters" to="/n/:namespace/filters" />
            <Redirect from="/:namespace/handlers" to="/n/:namespace/handlers" />
            <Redirect from="/:namespace/mutators" to="/n/:namespace/mutators" />
            <Redirect from="/:namespace/silences" to="/n/:namespace/silences" />
            <Redirect from="/:namespace" to="/n/:namespace/events" />
            <Route component={NotFoundView} />
          </Switch>
          <ContextSwitcherKeybinding />
          <ContextSwitcherDialog />
          <PreferencesKeybinding />
        </AppRoot>
      </BrowserRouter>
    </ErrorBoundary>,
    document.getElementById("root"),
  );
};

polyfill()
  .then(updateServiceWorker)
  .then(renderApp);
