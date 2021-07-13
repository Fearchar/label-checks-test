const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  /* todo: fm - get ride of all the uneeded mentions of github */
  try {
    const [gitHubRepoOwner, gitHubRepoName] =
      process.env.GITHUB_REPOSITORY.split("/");
    const gitHubSha = process.env.GITHUB_SHA;
    const gitHubToken = core.getInput("github-token");

    const octokit = github.getOctokit(gitHubToken);

    octokit.rest.checks.create({
      /* todo: fm - add accept?*/
      accept: "application/vnd.github.v3+json",
      owner: gitHubRepoOwner,
      repo: gitHubRepoName,
      name: "Simple Check",
      head_sha: gitHubSha,
      conclusion: "success",
      status: "completed",
    });

    core.setOutput("pullNumber", github.event.pull_request.number);
    /* todo: fm - localise time to utc */
    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
