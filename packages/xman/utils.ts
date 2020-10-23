import {spawn, spawnSync} from 'child_process';
import fs from 'fs';

export function run(
  cmd: string,
  {
    stdout,
    stderr,
  }: {
    stdout?: (data: Buffer) => void;
    stderr?: (data: Buffer) => void;
  } = {},
) {
  return new Promise((resolve, reject) => {
    const [script, ...params] = cmd.split(/\s+/);
    const child = spawn(script, params);
    child.stdout.on('data', (data: Buffer) => {
      stdout ? stdout(data) : process.stdout.write(data);
    });
    child.stderr.on('data', (data: Buffer) => {
      stderr ? stderr(data) : process.stderr.write(data);
    });
    child.on('exit', (data) => {
      resolve(data);
    });
    child.on('error', (data) => {
      reject(data);
      child.kill();
    });
  });
}

export function runSync(cmd: string) {
  const [script, ...params] = cmd.split(/\s+/);
  return spawnSync(script, params);
}

export function readFile(path: string) {}

export function readDir() {}

export function exists(path: string) {
  return access(path, fs.constants.F_OK);
}
export function writeFile(path: string, data: string | Buffer) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
export function isDir(path: string) {
  return access(path, fs.constants.O_DIRECTORY);
}

function access(path: string, mode: number | undefined) {
  return new Promise((resolve) => {
    fs.access(path, mode, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}
