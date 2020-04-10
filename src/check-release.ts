import { Octokit } from "@octokit/rest";
import { Context } from "@actions/github/lib/context";
import { OctokitResponse } from "@octokit/types";

export const checkIfReleaseExists = (githubClient: Octokit, context: Context): Promise<OctokitResponse<any>> => {
    return githubClient.repos.getReleaseByTag({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag: context.ref,
    })
        .catch((err: any): Promise<OctokitResponse<typeof githubClient.>> => {
            if (err && err.status === 404) {
                return Promise.resolve(undefined) as any;
            }
            return Promise.reject(err);
        });
};
