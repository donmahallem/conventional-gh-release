/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */

import * as actionscore from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { OctokitResponse } from '@octokit/types';
import { checkIfReleaseExists } from './check-release';
import { IConfig } from './config';
import { createChangelog } from './create-changelog';

// tslint:disable-next-line:triple-equals
const config: IConfig = {
    FILTER: actionscore.getInput('filter', {
        required: false,
    }),
    GITHUB_SECRET: actionscore.getInput('github_secret', {
        required: true,
    }),
};
const runa = async (): Promise<void> => {
    const githubClient: Octokit = new github.GitHub(config.GITHUB_SECRET) as Octokit;
    const resp: OctokitResponse<any> = await checkIfReleaseExists(githubClient, github.context);
    if (resp) {
        actionscore.setOutput('releaseId', '' + resp.data.id);
        actionscore.setOutput('releaseUrl', resp.data.html_url);
        actionscore.info('Version already released');
    } else {
        const changelogMessage: string = await createChangelog({
            outputUnreleased: false,
            preset: 'angular',
            releaseCount: 2,
        });
        actionscore.setOutput('changelog', changelogMessage);
        console.log('kk', changelogMessage);
        const resp2: any = await githubClient.repos.createRelease({
            body: changelogMessage,
            draft: false,
            name: 'Release ' + github.context.ref,
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            tag_name: (github.context.ref.split('\/').slice(2).join('')),
            target_commitish: github.context.sha,
        });
        actionscore.setOutput('releaseId', '' + resp2.data.id);
        actionscore.setOutput('releaseUrl', resp2.data.html_url);
    }
};

runa().catch((err: any): void => {
    actionscore.error(err.toString());
    actionscore.setFailed('Error');
}).then((): void => {
    actionscore.info('Success');
});
