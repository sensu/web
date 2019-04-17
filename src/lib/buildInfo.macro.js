const gitRevSync = __non_webpack_require__("git-rev-sync");

export default () => {
  const webRevision = gitRevSync.short();

  return `module.exports = ${JSON.stringify({ webRevision })}`;
};
