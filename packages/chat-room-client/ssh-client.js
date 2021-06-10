const { Client } = require('ssh2');
const { LOGGER } = require('@llearn/app-common');

class SshClient {
  constructor(i) {
    this.index = i;
    this._client = null;
  }

  start = async () => {
    console.log(`Start ssh client index ${this.index}`);
    this._client = new Client();
    this._client.on('ready', this._onReady);
    this._client.on('error', this._onError);
    this._client.connect({
      host: '10.109.35.51',
      port: 22,
      username: 'xiao',
      password: 'compalswhq',
    });
    return new Promise((res, rej) => {
      this._client.once('ready', () => {
        LOGGER.info(`Number ${this.index} connected`);
        res();
      });
      this._client.once('error', (err) => {
        LOGGER.info(`Number ${this.index} Error`);
        rej(err);
      });
    });
  }

  _onReady = () => {
    console.log(`${this.index} ssh client was ready..`);
  }

  _onError = (err) => {
    console.log(`${this.index} fail`);
    console.error(err);
  }
}

module.exports = SshClient;
