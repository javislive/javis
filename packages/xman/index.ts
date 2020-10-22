import os from 'os';
const args = process.argv.slice(2);
const cmd = args.shift();
const path = require('path');
const metro = require('./metro');
const fs = require('fs');
const {execSync} = require('child_process');
let platform = 'android';
let falvors = ['server', 'client'];
for (let i = 0; i < args.length; i++) {
  let arg = args[i];
  if (arg[0] == '-') {
    arg = arg.slice(1);
    i++;
    let v = args[i];
    switch (arg) {
      case 't':
        falvors =
          v == 'client'
            ? ['client']
            : (v = 'server' ? ['server'] : ['server', 'client']);
        break;
      case 'p':
        platform = v || platform;
        break;
    }
  }
}
// const falvors = args.shift() === '-c' ? ['client'] : ['server', 'client'];
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
  process.chdir('android');
  const cmd = process.platform.startsWith('win') ? 'gradlew.bat' : './gradlew';

  falvors.forEach((falvor) => {
    buildMetro(buildType, falvor);
    falvor = falvor[0].toUpperCase() + falvor.slice(1);

    shelljs.exec(`${cmd} assemble${falvor}${buildCMD}`);
  });
}
function release(buildType, platform, falvors) {
  if (platform === 'android') {
    relaseAndroid(buildType, falvors);
  }
}
function run() {
  switch (cmd) {
    case 'start':
      return start();
    case 'uat':
      return release('uat', platform, falvors);
    case 'release':
      return release('prod', platform, falvors);
    case 'debug':
      return release('debug', platform, falvors);
    default:
      break;
  }
}

run();
