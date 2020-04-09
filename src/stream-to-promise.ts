/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */

import { Readable } from 'stream';
type ResolveBuffer = (res: Buffer) => void;
type PromiseReject = (rej: any) => void;
export const streamToPromise = (inputStream: Readable): Promise<Buffer> => {
    const outputChunks: Buffer[] = [];

    return new Promise((resolve: ResolveBuffer, reject: PromiseReject): void => {

        inputStream.on('data', (chunk: Buffer) => outputChunks.push(chunk));
        inputStream.on('error', reject);
        inputStream.on('end', () => resolve(Buffer.concat(outputChunks)));
    });
};
