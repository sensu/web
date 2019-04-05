import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import git from "git-rev-sync";

const currentRev = git.long();
const pkgFilename = "dashboard.tgz";

const bucket = "sensu-ci-web-build";
const pathPrefix = "/oss/webapp";

const outPath = path.join(pathPrefix, currentRev, "web.tgz");
const refPath = path.join(pathPrefix, "master");

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
      console.info(chalk.red("info"), "successfully uploaded files");
    });
  });
};

// Read file from disk
let pkgFile;
try {
  const pkgPath = path.join(__dirname, "..", pkgFilename);
  console.info(pkgPath);
  pkgFile = fs.readFileSync(pkgPath);
} catch (e) {
  console.error(
    chalk.red("error"),
    "unable to find package file; ensure that you have built it before attempting to upload",
    e,
  );
  process.exit(1);
}

// Upload
console.info(chalk.red("info"), "uploading artifact to", outPath);
upload(outPath, pkgFile)
  .then(() => console.info(chalk.red("info"), "successfully uploaded files"))
  .catch(err => console.error(chalk.red("error"), err));

// Update Ref
if (git.branch() === "master") {
  upload(refPath, currentRev)
    .then(() => console.info(chalk.red("info"), "successfully updated ref"))
    .catch(err => console.error(chalk.red("error"), err));
}
