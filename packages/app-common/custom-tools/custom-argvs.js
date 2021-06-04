const yargs = require('yargs');

const _argvs = yargs
  .options({
    logpath: {
      demandOption: false,
      describe: 'Set the logger path',
      default: './logs',
    },
    length: {
      alias: 'l',
      demandOption: false,
      describe: 'Set max socket client length, default to 1',
      default: '1',
    },
    rooms: {
      alias: 'r',
      demandOption: false,
      describe: 'Set max room length, default to 1',
      default: '1',
    },
  })
  .help()
  .alias('help', 'h')
  .epilogue('Copyright@hand').argv;

module.exports = _argvs;
