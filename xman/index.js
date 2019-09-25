#!/usr/bin/env node

const args = process.argv.slice(2);
const cmd = args.shift();
const shelljs = require('shelljs');
const path = require('path');
const metro = require('./metro');
const fs = require('fs');

const platform = args.shift() === '-c' ? 'client' : 'server';
function buildMetro(env) {
  const config = metro(env, platform);
  const data = `module.exports=${JSON.stringify(config, null, '\t')}`;
  fs.writeFileSync(
    path.resolve(__dirname, '../metro.config.js'),
    data,
    'utf-8',
  );
}
function start() {
  buildMetro('debug');
  shelljs.exec('react-native start');
}
function uat() {
  buildMetro('uat');
}
function release() {
  buildMetro('prod');
}
function relaseAndroid(buildType, falvors) {}
function run() {
  switch (cmd) {
    case 'start':
      return start();
    case 'uat':
      return uat();
    case 'relase':
      return release();
    default:
      break;
  }
}

run();
