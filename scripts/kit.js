const minimist = require('minimist');
const init = require('./init');
const argv = minimist(process.argv.slice(2));
const build = require('./build');
const deploy = require('./deploy');
const start = require('./start');

const {
  _: [cmd, arg],
  ...args
} = argv;

args.cmd = arg;
function run(cmd, args) {
  switch (cmd) {
    case 'init':
      init(args);
      break;
    case 'build':
      build(args);
      break;
    case 'deploy':
      deploy(args);
      break;
    case 'start':
      start(args);
      break;
    default:
      require('./' + cmd)(args);
  }
}

run(cmd, args);
