/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */

import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { OctokitResponse } from '@octokit/types';

export const checkIfReleaseExists = (githubClient: Octokit, context: Context): Promise<OctokitResponse<any>> => {
    return githubClient.repos.getReleaseByTag({
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag: context.ref,
    })
        .catch((err: any): Promise<any> => {
            if (err && err.status === 404) {
                return Promise.resolve(undefined) as any;
            }
            return Promise.reject(err);
        });
};
