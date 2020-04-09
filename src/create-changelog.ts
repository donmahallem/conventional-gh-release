/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */

import { streamToPromise } from "./stream-to-promise";
import * as conventionalChangelog from "conventional-changelog";
export const createChangelog: (opts: conventionalChangelog.Options) => Promise<string> =
    (opts: conventionalChangelog.Options): Promise<string> => {
        return streamToPromise(conventionalChangelog(opts)).then((val: Buffer): string => {
            return val.toString('utf8');
        });
    }
