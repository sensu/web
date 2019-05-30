import process from "process";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import git from "git-rev-sync";

const artifactPath = process.argv[3] || "./dashboard.tgz";
const pathPrefix = process.argv[4] || "oss/webapp";
const bucket = "sensu-ci-web-builds";

const currentRev = git.long();
const outPath = path.join(pathPrefix, currentRev, path.basename(artifactPath));

const error = (...msg) => console.error(chalk.red("error"), ...msg);
const info = (...msg) => console.info(chalk.blue("info"), ...msg);

// Setup client
const s3 = new AWS.S3();
const upload = (Key, Body) => {
  return new Promise((resolve, reject) => {
    s3.upload({ Bucket: bucket, ACL: "public-read", Key, Body }, err => {
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
let artifactFile;
try {
  artifactFile = fs.readFileSync(path.join(process.cwd(), artifactPath));
} catch (e) {
  console.error(
    chalk.red("error"),
    "unable to find artifact; ensure that built it before attempting to upload.",
  );
  process.exit(1);
}

// Upload
info("uploading artifact to", outPath);
upload(outPath, artifactFile)
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
