const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const [gitHubRepoOwner, gitHubRepoName] =
      process.env.GITHUB_REPOSITORY.split("/");
    const gitHubSha = process.env.GITHUB_SHA;
    const gitHubToken = core.getInput("github-token");

    const octokit = github.getOctokit(gitHubToken);

    octokit.rest.checks.create({
      owner: gitHubRepoOwner,
      repo: gitHubRepoName,
      name: "Check Created by API",
      head_sha: gitHubSha,
      status: "completed",
      conclusion: "success",
      output: {
        title: "Check Created by API",
        /* debug: fm - */
        summary: "",
      },
    });

    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
