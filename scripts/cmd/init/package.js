const path = require('path');

const FILE_LIST = [
  {
    name: 'package.json',
    content({name}) {
      return {
        name: `@perf-lab/${name}`,
        author: 'Spencer Ye',
        license: 'Apache-2.0',
        jest: {
          verbose: true,
          testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
          moduleFileExtensions: ['ts', 'js'],
          moduleDirectories: ['node_modules', 'src'],
          transform: {
            '^.+\\.tsx?$': 'ts-jest',
          },
        },
      };
    },
  },
  {
    name: 'README.md',
    content({name}) {
      return `# ${name}`;
    },
  },
];
async function run(args) {
  const {name} = args;
  // 根路径写死，之后可能会改
  const dir = path.resolve('./packages', name);
  const exts = await exists(dir);
  if (!exts) {
    await mkdirs(dir);
  }
  for (let i = 0; i < FILE_LIST.length; i++) {
    const {name, content} = FILE_LIST[i];
    const filePath = path.join(dir, name);
    if (!(await exists(filePath))) {
      let fileContent = '';
      if (typeof content === 'function') {
        let result = content(args);
        fileContent =
          typeof result === 'string'
            ? result
            : JSON.stringify(result, null, '  ');
      } else {
        fileContent = content;
      }
      await writeFile(filePath, fileContent);
    }
  }
}

module.exports = run;
