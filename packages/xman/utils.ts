import {rejects} from 'assert';
import {spawn, spawnSync} from 'child_process';
import {resolve} from 'dns';
import fs from 'fs';

export function run(
  cmd: string,
  {
    stdout,
    stderr,
  }: {
    stdout?: (data: Buffer) => void;
    stderr?: (data: Buffer) => void;
  },
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
  return new Promise((resolve, reject) => {
    try {
      fs.access(path, fs.constants.F_OK, () => {
        resolve(true);
      });
    } catch (e) {
      reject(false);
    }
  });
}

export function isDir() {}
