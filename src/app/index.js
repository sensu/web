import handle from "/lib/exceptionHandler";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import injectTapEventPlugin from "react-tap-event-plugin";

// eslint-disable-next-line import/extensions
import "typeface-roboto";

import polyfill from "/lib/polyfill";

import createClient from "/lib/apollo/client";

import ErrorBoundary from "/lib/component/util/ErrorBoundary";

import AppRoot from "/app/component/AppRoot";

polyfill().then(() => {
  const client = createClient();

  // Renderer
  ReactDOM.render(
    <ErrorBoundary handle={handle}>
      <BrowserRouter>
        <AppRoot apolloClient={client} />
      </BrowserRouter>
    </ErrorBoundary>,
    document.getElementById("root"),
  );
});

// Register React Tap event plugin
injectTapEventPlugin();
