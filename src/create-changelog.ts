/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */

import * as conventionalChangelog from 'conventional-changelog';
import { streamToPromise } from './stream-to-promise';
export const createChangelog: (opts: conventionalChangelog.Options) => Promise<string> =
    (opts: conventionalChangelog.Options): Promise<string> => {
        return streamToPromise(conventionalChangelog(opts)).then((val: Buffer): string => {
            return val.toString('utf8');
        });
    };
