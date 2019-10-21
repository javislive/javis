/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 */
const path = require('path');
const fs = require('fs');
const {resolve} = path;
const root = resolve(__dirname, '../');
const APP_PATH = resolve(root, 'app');

function pathResolve(path) {
  return path.resolve(root, path);
}

const extraNodeModules = {};

fs.readdirSync(APP_PATH).forEach(name => {
  const ap = resolve(APP_PATH, name);
  if (fs.statSync(ap).isDirectory()) {
    extraNodeModules[name] = ap;
  }
});

function metro(env, platform) {
  return {
    transformer: {
      asyncRequireModulePath: 'react-native-typescript-transformer',
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      sourceExts: [
        `${env}.tsx`,
        `${env}.ts`,
        `${platform}.tsx`,
        `${platform}.ts`,
        'js',
        'ts',
        'tsx',
      ],
      extraNodeModules,
    },
    projectRoot: root,
  };
}
module.exports = metro;
