/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 */
const path = require('path');
const root = path.resolve(__dirname, '../');
function pathResolve(path) {
  return path.resolve(root, path);
}
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
      extraNodeModules: {
        'react-native-ui': path.resolve(root, './app/react-native-ui'),
        services: path.resolve(root, './app/services'),
        context: path.resolve(root, './app/context'),
        native: path.resolve(root, './app/native'),
        utils: path.resolve(root, './app/utils'),
        assets: path.resolve(root, './app/assets'),
        themes: path.resolve(root, './app/themes'),
        components: path.resolve(root, './app/components'),
        router: path.resolve(root, './app/router'),
        BuildConfig: path.resolve(root, './app/BuildConfig'),
        pages: path.resolve(root, './app/pages'),
        store: path.resolve(root, './app/store'),
        controller: path.resolve(root, './app/controller'),
        state: path.resolve(root, './app/state'),
        celtics: path.resolve(root, './app/celtics'),
      },
    },
    projectRoot: path.resolve(root),
  };
}
module.exports = metro;
