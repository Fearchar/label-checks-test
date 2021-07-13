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
    const pullNumber = core.getInput("pull-number");

    const octokit = github.getOctokit(gitHubToken);

    const pullResponse = await octokit.rest.pulls.get({
      owner: gitHubRepoOwner,
      repo: gitHubRepoName,
      pull_number: pullNumber,
    });
    const pull = pullResponse.data;

    if (!pullResponse.status === 200) {
      core.setFailed(`There is no pull request with the number ${pullNumber}`);
    }

    if (!pull.labels.find((label) => label.name === "QA Passed")) {
      core.setFailed(
        'Pull requests require the "QA Passed" label before they can be merged.'
      );
    }

    core.setOutput(
      "labels",
      pull.labels.map((label) => label.names)
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
