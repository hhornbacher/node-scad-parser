/// <reference types="node" />
import * as fs from 'fs';
export declare type GeneralFunction = (...a: Array<any>) => any;
export declare function pfy(func: GeneralFunction, resultKeys?: Array<string> | string): (...args: any[]) => Promise<{}>;
export declare type TmpOptions = {
    mode?: number;
    prefix?: string;
    postfix?: string;
    template?: string;
    dir?: string;
    tries?: number;
    keep?: boolean;
    unsafeCleanup?: boolean;
};
export declare type TmpResult = {
    path: string;
    fd: number;
    cleanupCb: (() => void) | null;
};
export declare const tmpFile: (options: TmpOptions) => Promise<TmpResult>;
export declare const tmpDir: (options: TmpOptions) => Promise<TmpResult>;
export declare const tmpName: (options: TmpOptions) => Promise<string>;
export declare const tmpSetGracefulCleanup: () => void;
export declare const write: (fd: number, data: string | Buffer, enc?: string) => Promise<number>;
export declare const open: (file: string, mode: string) => Promise<number>;
export declare const readFile: (file: string, enc?: string) => Promise<string | Buffer>;
export declare const writeFile: (file: string, data: string, enc?: string) => Promise<{}>;
export declare const symlink: (src: string, dst: string) => Promise<{}>;
export declare const stat: (path: string) => Promise<fs.Stats>;
export declare const exec: (command: string) => Promise<{}>;
