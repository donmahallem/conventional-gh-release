/*!
 * Source https://github.com/donmahallem/conventional-gh-release
 */
/// <reference types="node" />
import { Readable } from 'stream';
export declare const streamToPromise: (inputStream: Readable) => Promise<Buffer>;
