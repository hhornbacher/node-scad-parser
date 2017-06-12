import * as tmp from 'tmp';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as _ from 'lodash';

/*----- Promisification helpers -----*/
export type GeneralFunction = (...a: Array<any>) => any;
export function pfy(func: GeneralFunction, resultKeys?: Array<string> | string) {
    return (...args) => new Promise((resolve, reject) => {
        func(...args, (err: Error | null, ...result: Array<any>) => {
            if (err)
                return reject(err);
            if (!(result.length > 1) || _.isString(resultKeys) || !resultKeys)
                return resolve(result[0]);
            return resolve(_.zipObject(resultKeys, result));
        });
    });
}

/*----- Temporary file helpers -----*/
export type TmpOptions = {
    mode?: number,
    prefix?: string,
    postfix?: string,
    template?: string,
    dir?: string,
    tries?: number,
    keep?: boolean,
    unsafeCleanup?: boolean
}
export type TmpResult = {
    path: string,
    fd: number,
    cleanupCb: (() => void) | null
}

type _TmpFunc = (options: TmpOptions, cb: (err: Error | null, path: string, fd: number, cleanupCb: () => void) => void) => void;
declare const tmp: {
    file: _TmpFunc,
    dir: _TmpFunc,
    tmpName: _TmpFunc,
    setGracefulCleanup: () => void
};

export const tmpFile: (options: TmpOptions) => Promise<TmpResult> = pfy(tmp.file, ['path', 'fd', 'cleanupCb']);
export const tmpDir: (options: TmpOptions) => Promise<TmpResult> = pfy(tmp.dir, ['path', 'fd', 'cleanupCb']);
export const tmpName: (options: TmpOptions) => Promise<string> = pfy(tmp.tmpName);
export const tmpSetGracefulCleanup = tmp.setGracefulCleanup;


/*----- Promisified FS functions -----*/
export const write: (fd: number, data: string | Buffer, enc?: string) => Promise<number> = pfy(fs.write);
export const open: (file: string, mode: string) => Promise<number> = pfy(fs.open);
export const readFile: (file: string, enc?: string) => Promise<string | Buffer> = pfy(fs.readFile);
export const writeFile: (file: string, data: string, enc?: string) => Promise<{}> = pfy(fs.writeFile);
export const symlink: (src: string, dst: string) => Promise<{}> = pfy(fs.symlink);
export const stat: (path: string) => Promise<fs.Stats> = pfy(fs.stat);
export const exec: (command: string) => Promise<{}> = pfy(childProcess.exec);
