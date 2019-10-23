import config from './config';
import platform from './platform';

export default {
  env: 'dev',
  ...config,
  ...platform,
};
