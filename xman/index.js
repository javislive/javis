#!/usr/bin/env node
const os = require('os');
const args = process.argv.slice(2);
const cmd = args.shift();
const shelljs = require('shelljs');
const path = require('path');
const metro = require('./metro');
const fs = require('fs');

args.forEach(arg => {});
const falvors = args.shift() === '-c' ? ['client'] : ['server', 'client'];
function buildMetro(env, platform) {
  const config = metro(env, platform);
  const data = `module.exports=${JSON.stringify(config, null, '\t')}`;
  fs.writeFileSync(
    path.resolve(__dirname, '../metro.config.js'),
    data,
    'utf-8',
  );
}
function start() {
  buildMetro('debug', falvors[0]);
  shelljs.exec('react-native start');
}

function relaseAndroid(buildType, falvors) {
  let buildCMD = buildType[0].toUpperCase() + buildType.slice(1);
  if (buildType === 'prod') {
    buildCMD = 'Release';
  }
  falvors.forEach(falvors => {
    buildMetro(buildType, falvor);
    falvor = falvor[0].toUpperCase() + falvor.slice(1);
    if (os.type() === 'Windows_NT') {
      shelljs.exec(`android/gradlew assemble${buildCMD}${falvor}`);
    } else {
      shelljs.exec(`./android/gradlew assemble${buildCMD}${falvor}`);
    }
  });
}
function release(buildType, platform) {
  if (platform === 'android') {
    relaseAndroid('uat', platform);
  }
}
function run() {
  switch (cmd) {
    case 'start':
      return start();
    case 'release':
      return release('uat', platform);
    case 'android-release':
      return relaseAndroid('prod', platform);
    default:
      break;
  }
}

run();
