/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 */
import path from 'path';
import fs from 'fs';
const {resolve} = path;
const root = resolve('./');

export interface MetroConfig {
  pkg?: string;
  env: string;
  path: string;
  platform: string;
}
function metro({env, path, platform}: MetroConfig) {
  const extraNodeModules: {
    [key: string]: string;
  } = {};
  const APP_PATH = resolve(root, path);

  fs.readdirSync(APP_PATH).forEach((name: string) => {
    const ap = resolve(APP_PATH, name);
    if (fs.statSync(ap).isDirectory()) {
      extraNodeModules[name] = ap;
    }
  });
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
        `${platform}.ts`,
        `${platform}.tsx`,
        `${platform}.${env}.ts`,
        `${platform}.${env}.tsx`,
        'js',
        'ts',
        'tsx',
      ],
      extraNodeModules,
    },
    projectRoot: root,
  };
}
export default metro;
