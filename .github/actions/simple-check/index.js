const core = require("@actions/core");
const github = require("@actions/github");

function getActionDetails() {
  const token = core.getInput("github-token");
  const pullNumber = core.getInput("pull-number");

  const [repoOwner, repoName] = process.env.GITHUB_REPOSITORY.split("/");

  return { token, pullNumber, repoOwner, repoName };
}

function getPullRequest(token, repoOwner, repoName, pullNumber) {
  const octokit = github.getOctokit(token);

  const response = await octokit.rest.pulls.get({
    owner: repoOwner,
    repo: repoName,
    pull_number: pullNumber,
  });

  if (!response.status === 200) {
    core.setFailed(`There is no pull request with the number ${pullNumber}`);
  }

  return response.data;
}

async function runAction() {
  try {
    const { token, repoOwner, repoName, pullNumber } = getActionDetails();

    const pullRequest = getPullRequest(token, repoOwner, repoName, pullNumber);

    if (!pullRequest.labels.find((label) => label.name === "QA Passed")) {
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
