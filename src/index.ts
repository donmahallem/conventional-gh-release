/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */

import * as actionscore from '@actions/core';
import * as github from '@actions/github';
import * as conventionalChangelog from 'conventional-changelog';
import { Octokit } from '@octokit/rest';
import { readFileSync } from 'fs';
import { IConfig } from './config';
import { streamToPromise } from './stream-to-promise';
import { createChangelog } from './create-changelog';
import { OctokitResponse } from '@octokit/types';

const insideActions: boolean = (process.env.GITHUB_ACTION || false) == 'true';
const config: IConfig = {
    FILTER: actionscore.getInput('filter', {
        required: false,
    }),
    GITHUB_SECRET: actionscore.getInput('github_secret', {
        required: insideActions,
    }),
};
actionscore.debug(JSON.stringify(config));
const runa = async (): Promise<void> => {
    const githubClient: Octokit = new github.GitHub(config.GITHUB_SECRET) as Octokit;
    if (github.context.action.localeCompare('push')) {
        try {
            const resp: OctokitResponse<any> =
                await githubClient.repos.getReleaseByTag({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    tag: github.context.ref,
                });
            actionscore.setOutput('releaseId', '' + resp.data.id);
            actionscore.setOutput('releaseUrl', resp.data.html_url);
            actionscore.info('Version already released');
        } catch (err) {
            if (err.status === 404) {
                const changelogMessage: string = await createChangelog({
                    outputUnreleased: false,
                    preset: 'angular',
                    releaseCount: 2,
                });
                actionscore.setOutput('changelog', changelogMessage);
                const resp: any = await githubClient.repos.createRelease({
                    body: changelogMessage,
                    draft: false,
                    name: 'Release ' + github.context.ref,
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    tag_name: github.context.ref,
                    target_commitish: github.context.sha,
                });
                actionscore.setOutput('releaseId', '' + resp.data.id);
                actionscore.setOutput('releaseUrl', resp.data.html_url);
            } else {
                actionscore.setFailed('Error occured: ' + err.status);
            }
        }
    }
};

runa().catch((err: any): void => {
    actionscore.error(err);
    actionscore.setFailed('Error');
}).then((): void => {
    actionscore.info('Success');
});
