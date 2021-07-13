const core = require("@actions/core");
const github = require("@actions/github");
/* todo: fm - rename run*/
async function run() {
  /* todo: fm - get ride of all the uneeded mentions of github */
  try {
    const [gitHubRepoOwner, gitHubRepoName] =
      process.env.GITHUB_REPOSITORY.split("/");
    const gitHubSha = process.env.GITHUB_SHA;
    const gitHubToken = core.getInput("github-token");

    const octokit = github.getOctokit(gitHubToken);

    const prResponse = await octokit.rest.pulls.get({
      owner: gitHubRepoOwner,
      repo: gitHubRepoName,
      pull_number: core.getInput("pull-number"),
    });
    const pr = prResponse.data;

    if (!pr.labels.find((label) => label.name === "QA Passed")) {
      core.setFailed(
        'Pull requests require the "QA Passed" label before they can be merged.'
      );
    }
    /* todo: fm - localise time to utc */
    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
