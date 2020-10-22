import {exists} from './../utils';
import {resolve} from 'path';
test('exists', async () => {
  let result = await exists(resolve('bin.js'));
  expect(result).toBeTruthy();
  result = await exists('./../bin22.js');
  expect(result).toBeFalsy();
});
