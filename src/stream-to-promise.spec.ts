/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */

import { expect } from 'chai';
import 'mocha';
import { Readable } from 'stream';
import { streamToPromise } from './stream-to-promise';

describe('stream-to-promise.ts', (): void => {
    it('should reutrn the resolved Readable stream', (): Promise<void> => {
        const testBuffer: Buffer[] = ['a', 'b', '\n', 'q']
            .map((val: string): Buffer => Buffer.from(val, 'utf8'));
        const testReadable: Readable = Readable.from(testBuffer);
        return streamToPromise(testReadable)
            .then((val: Buffer): void => {
                expect(val.toString('utf8')).to.equal('ab\nq');
            });
    });
});
