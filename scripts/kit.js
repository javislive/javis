const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));

const {
  _: [cmd, arg],
  ...args
} = argv;

args.cmd = arg;
function run(cmd, args) {
  require('./cmd/' + cmd)(args);
}

run(cmd, args);
