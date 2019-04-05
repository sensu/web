import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import git from "git-rev-sync";

const currentRev = git.long();
const pkgFilename = "dashboard.tgz";

const bucket = "sensu-ci-web-builds";
const pathPrefix = "/oss/webapp";
const outPath = path.join(pathPrefix, currentRev, "package.tgz");

const error = (...msg) => console.error(chalk.red("error"), ...msg);
const info = (...msg) => console.info(chalk.blue("info"), ...msg);

// Setup client
const s3 = new AWS.S3();
const upload = (Key, Body) => {
  return new Promise((resolve, reject) => {
    s3.upload({ Bucket: bucket, Key, Body }, err => {
      if (err) {
        reject(err);
        console.error(chalk.red("error"), err);
        process.exit(1);
      }
      resolve();
    });
  });
};

// Read file from disk
let pkgFile;
try {
  pkgFile = fs.readFileSync(path.join(__dirname, "..", pkgFilename));
} catch (e) {
  console.error(
    chalk.red("error"),
    "unable to find package file; ensure that you have built it before attempting to upload",
    e,
  );
  process.exit(1);
}

// Upload
info("uploading artifact to", outPath);
upload(outPath, pkgFile)
  .then(() => info("successfully uploaded files"))
  .catch(err => error(err));

// Update Ref
let ref = git.branch();
if (git.tag() !== currentRev) {
  ref = git.tag();
}

info("updating ref at", pathPrefix, ref);
upload(path.join(pathPrefix, ref), currentRev)
  .then(() => info("successfully updated ref"))
  .catch(err => error(err));
