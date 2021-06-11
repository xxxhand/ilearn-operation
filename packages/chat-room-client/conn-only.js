const { customArgvs } = require('@llearn/app-common/custom-tools');
const SocketClient = require('./socker-client');

async function _tryConnecting() {
  for (let i = 0; i < customArgvs.length; i++) {
    try {
      const s = new SocketClient(i);
      await s.start();
    } catch (ex) {
      console.log(ex);
    }
  }
}

async function main() {
  console.log(`Start to ${customArgvs.length} clients`);
  await _tryConnecting();
}

main().catch((ex) => console.log(ex));