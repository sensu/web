import path from "path";
import fs from "fs";
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

const root = fs.realpathSync(process.cwd());
const proxyPaths = ["/auth", "/graphql", "/api"];
const port = parseInt(process.env.PORT, 10) || 3001;

const apiUrl = process.env.API_URL || "http://localhost:8080";

const compiler = webpack(config);
const app = express();

app.use(compression());

app.use(
  proxy(proxyPaths, {
    target: apiUrl,
    logLevel: "silent",
  }),
);

app.use(express.static(path.join(root, "build/vendor/public")));

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(root, "build/lib/public")));
}

app.use(historyFallback());

const instance = devMiddlware(compiler);
app.use(instance);

const server = killable(http.createServer(app));

["SIGINT", "SIGTERM"].forEach(sig => {
  process.on(sig, () => {
    console.info(`Process Ended via ${sig}`);
    instance.close();
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
