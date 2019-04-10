import fs from "fs";
import https from "https";
import path from "path";

import fsPromise from "./util/fsPromise";
import api from "./util/githubApi";

import pkg from "../package.json";

const MAX_PARALLEL_REQUESTS = 5;

const schemaDir = path.resolve(".schema");
const lockFilePath = path.join(schemaDir, "lock.json");

const readLockFile = () =>
  fsPromise.readFile(lockFilePath, "utf-8").then(
    contents => JSON.parse(contents),
    error => {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    },
  );

const updateLockFile = contents =>
  fsPromise.writeFile(lockFilePath, JSON.stringify(contents, null, 2), "utf-8");

const fetchSchemaContents = (ref = "master") => {
  console.log(`fetching graphql schema from sensu-go/${ref}`);
  return api.repos
    .getContents({
      owner: "sensu",
      repo: "sensu-go",
      path: "backend/apid/graphql/schema",
      ref,
    })
    .then(result => result.data.filter(item => /\.graphql$/.test(item.name)));
};

const fetch = (url, filePath) =>
  new Promise((resolve, reject) => {
    const done = (error, ...args) => {
      if (error) {
        reject(error);
      } else {
        resolve(args);
      }
    };

    const fileStream = fs.createWriteStream(filePath);

    const request = https.get(url, response => {
      response.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close(done);
      });
    });

    request.on("error", done);
  });

const lockFilePromise = readLockFile();

const exists = filePath =>
  fsPromise.stat(filePath).then(
    () => true,
    error => {
      if (error.code === "ENOENT") {
        return false;
      }
      throw error;
    },
  );

const updateLocal = remoteItem => {
  const filePath = path.join(schemaDir, remoteItem.name);

  return lockFilePromise
    .then(localContents =>
      localContents.find(
        localItem =>
          localItem.name === remoteItem.name &&
          localItem.sha === remoteItem.sha,
      ),
    )
    .then(currentItem => !!currentItem && exists(filePath))
    .then(localFileExists => {
      if (!localFileExists) {
        console.log("updating local", filePath);
        return fetch(remoteItem.download_url, filePath);
      }
      return Promise.resolve();
    });
};

const mapPromiseParallel = (items, max, callback) =>
  new Promise((resolve, reject) => {
    const remaining = [...items];
    const result = [];

    let count = 0;

    const run = () => {
      if (remaining.length === 0 && count === 0) {
        resolve(result);
      }

      if (remaining.length && count < max) {
        count += 1;
        callback(remaining.pop()).then(() => {
          count -= 1;
          run();
        }, reject);
        run();
      }
    };

    run();
  });

fsPromise
  .mkdir(schemaDir)
  .catch(error => {
    if (error.code !== "EEXIST") {
      throw error;
    }
  })
  .then(() => fetchSchemaContents(pkg.graphQLSchemaRef))
  .then(remoteContents =>
    mapPromiseParallel(remoteContents, MAX_PARALLEL_REQUESTS, updateLocal)
      .then(() => remoteContents.map(({ name, sha }) => ({ name, sha })))
      .then(items => updateLockFile(items)),
  );
