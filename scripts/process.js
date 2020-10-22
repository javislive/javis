const {spawn} = require('child_process');

module.exports = {
  run(cmd, {stdout, stderr} = {}) {
    const [srcipt, ...args] = cmd.split(/\s+/);
    return new Promise(res => {
      const child = spawn(srcipt, args);
      child.stdout.on('data', data => {
        stdout ? stdout(data) : process.stdout.write(data);
      });
      child.stderr.on('data', data => {
        stderr ? stderr(data) : process.stderr.write(data);
      });
      child.on('exit', () => {
        res();
      });
    });
  },
};
