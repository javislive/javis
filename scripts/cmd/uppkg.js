const {run} = require('../process');

module.exports = async function upgrade() {
  const {dependencies, devDependencies} = require('../../package.json');
  await run(
    'yarn add -W ' +
      Object.keys(dependencies)
        .map(name => {
          return name + '@latest';
        })
        .join(' '),
  );
  await run(
    'yarn add -W -D ' +
      Object.keys(devDependencies)
        .map(name => {
          return name + '@latest';
        })
        .join(' '),
  );
};
