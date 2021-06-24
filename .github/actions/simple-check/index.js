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
      owner: gitHubRepoOwner,
      repo: gitHubRepoName,
      name: "Simple Check",
      head_sha: gitHubSha,
      status: "completed",
      conclusion: "failure",
      /* todo: fm - do I need output? */
      output: {
        title: "Check Created by API",
        /* debug: fm - */
        summary: "",
      },
    });

    core.setFailed("Intentional fail");

    /* todo: fm - localise time to utc */
    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
