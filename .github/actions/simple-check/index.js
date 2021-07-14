const core = require("@actions/core");
const github = require("@actions/github");

function getActionDetails() {
  const gitHubToken = core.getInput("github-token");
  const pullNumber = core.getInput("pull-number");

  const [gitHubRepoOwner, gitHubRepoName] =
    process.env.GITHUB_REPOSITORY.split("/");

  return { gitHubToken, pullNumber, gitHubRepoOwner, gitHubRepoName };
}

function getPullRequest(
  gitHubToken,
  gitHubRepoOwner,
  gitHubRepoName,
  pullNumber
) {
  const octokit = github.getOctokit(gitHubToken);

  const response = await octokit.rest.pulls.get({
    owner: gitHubRepoOwner,
    repo: gitHubRepoName,
    pull_number: pullNumber,
  });

  if (!response.status === 200) {
    core.setFailed(`There is no pull request with the number ${pullNumber}`);
  }

  return response.data;
}

/* todo: fm - rename run*/
async function runAction() {
  /* todo: fm - get ride of all the uneeded mentions of github */
  try {
    const { gitHubToken, gitHubRepoOwner, gitHubRepoName, pullNumber } =
      getActionDetails();

    const pullRequest = getPullRequest(
      gitHubToken,
      gitHubRepoOwner,
      gitHubRepoName,
      pullNumber
    );

    if (!pullRequest.labels.find((label) => label.name === "QA Passed")) {
      /* note: fm - returns aren't strictly needed. they're for the benifit of code clarity*/
      core.setFailed(
        'Pull requests require the "QA Passed" label before they can be merged.'
      );
      return;
    }

    core.setOutput(
      "labels",
      JSON.stringify(pullRequest.labels.map((label) => label.name))
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

runAction();
