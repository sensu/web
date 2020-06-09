import http from "http";

import historyFallback from "connect-history-api-fallback";
import killable from "killable";
import express from "express";
import compression from "compression";
import proxy from "http-proxy-middleware";
import devMiddlware from "webpack-dev-middleware";
import webpack from "webpack";

import "./util/exceptionHandler";
import config from "../config/app.webpack.config";

const proxyPaths = ["/auth", "/graphql", "/api"];
const port = parseInt(process.env.PORT, 10) || 3001;

const apiUrl = process.env.API_URL || "http://localhost:8080";

const app = express();

app.use(compression());

app.use(
  proxy(proxyPaths, {
    target: apiUrl,
    logLevel: process.env.NODE_ENV === "development" ? "silent" : "info",
  }),
);

app.use(historyFallback());

const compiler = webpack(config);
const instance = devMiddlware(compiler);
app.use(instance);

const server = killable(http.createServer(app));

["SIGINT", "SIGTERM"].forEach(sig => {
  process.on(sig, () => {
    console.info(`Process Ended via ${sig}`);
    if (instance) {
      instance.close();
    }
    server.kill();
  });
});

server.on("error", error => {
  throw error;
});

server.on("listening", () => {
  console.log("listening on", server.address().port);
});

server.listen(port);
