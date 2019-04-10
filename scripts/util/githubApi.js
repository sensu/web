import OctokitRest from "@octokit/rest";
import OctokitPluginThrottling from "@octokit/plugin-throttling";

OctokitRest.plugin(OctokitPluginThrottling);

export default new OctokitRest({
  throttle: {
    onRateLimit: (retryAfter, options) => {
      console.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`,
      );

      if (options.request.retryCount === 0) {
        // only retries once
        console.log(`Retrying after ${retryAfter} seconds!`);
        return true;
      }

      return false;
    },
    onAbuseLimit: (retryAfter, options) => {
      // does not retry, only logs a warning
      console.warn(
        `Abuse detected for request ${options.method} ${options.url}`,
      );
    },
  },
});
