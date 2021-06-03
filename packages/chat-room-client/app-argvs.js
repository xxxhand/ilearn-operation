const yargs = require('yargs');

const _argvs = yargs
  .options({
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
    }
  })
  .help()
  .alias('help', 'h')
  .epilogue('copyright@xxxhand')
  .argv;

module.exports = _argvs;
