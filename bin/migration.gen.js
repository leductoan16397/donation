#! /usr/bin/env node
const shell = require('shelljs');

const parseArgs = (args) => {
  const parsedArgs = {};

  args.forEach((arg) => {
    const parts = arg.split('=');

    parsedArgs[parts[0]] = parts[1];
  });

  return parsedArgs;
};

const args = parseArgs(process.argv);

const { name } = args;

if (!name) {
  throw new Error('Missing argument "name"');
}

shell.exec(`npm run build && npx typeorm -d dist/data.source.js migration:generate src/migration/${name}`);
