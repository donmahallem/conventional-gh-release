import { GetResponseTypeFromEndpointMethod } from "@octokit/types";
import { Octokit } from "@octokit/rest";

export type GetGithubReleaseByTag = GetResponseTypeFromEndpointMethod<
    typeof Octokit.issues.createLabel
>;
