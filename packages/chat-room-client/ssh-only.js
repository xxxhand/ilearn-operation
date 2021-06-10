const { customArgvs } = require('@llearn/app-common/custom-tools');
const SshClient = require('./ssh-client');

async function _tryConnecting() {
  for (let i = 0; i < customArgvs.length; i++) {
    try {
      const s = new SshClient(i);
      await s.start();
    } catch (ex) {
      console.log('errrrrrrr');
    }
  }
}

async function main() {
  console.log(`Start to ${customArgvs.length} clients`);
  await _tryConnecting();
}

main().catch((ex) => console.log(ex));