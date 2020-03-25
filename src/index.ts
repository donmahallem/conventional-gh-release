/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */

import * as actionscore from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { OctokitResponse } from '@octokit/types';
import { readFileSync } from 'fs';
import { IConfig } from './config';

const config: IConfig = {
    FILTER: actionscore.getInput('filter', {
        required: false,
    }),
    GITHUB_SECRET: actionscore.getInput('github_secret', {
        required: true,
    }),
};
const readPackage: () => any = (): any =>
    JSON.parse(readFileSync('./package.json', 'utf-8'));
const runa = async (): Promise<void> => {
    const githubClient: Octokit = new github.GitHub(config.GITHUB_SECRET) as Octokit;
    if (github.context.action.localeCompare('push')) {
        const packageInfo: {
            name: string,
            version: string,
        } = readPackage();
        const versionTagName: string = 'v' + packageInfo.version;
        actionscore.info('Checking Version: ' + versionTagName);
        try {
            const resp: OctokitResponse<any> =
                await githubClient.repos.getReleaseByTag({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    tag: versionTagName,
                });
            actionscore.setOutput('releaseId', '' + resp.data.id);
            actionscore.setOutput('releaseUrl', resp.data.html_url);
            actionscore.info('Version already released');
        } catch (err) {
            if (err.status === 404) {
                const resp: any = await githubClient.repos.createRelease({
                    draft: false,
                    name: 'Release ' + packageInfo.version,
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    tag_name: 'v' + packageInfo.version,
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

runa().catch((err: any) => {
    actionscore.error(err);
    actionscore.setFailed('Error');
}).then(() => {
    actionscore.info('Success');
});
