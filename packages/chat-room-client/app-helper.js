const { Types } = require('mongoose');
const { default: nodeFetch } = require('node-fetch');

const _SECONDS = [60, 120, 180];

class AppHelper {
  static get chatDomain() {
    // return 'http://localhost:9002'; // for local
    return 'https://icarechatuat.compal-health.com'; // for uat w/ nginx
    // return 'http://104.199.235.97:12320'
  }

  static get createRoomApi() {
    return 'api/v1/chat-rooms';
  }

  static get chatRoomNameSpace() {
    return 'wss/v1/chat-room';
  }

  static get rootCA() {
    // return 'ODYwM2YxNTctZTUzNy00NGNiLWI0NTctNWI5OTJmZGFjNTNl'; // for local
    return 'ODYwM2YxNTctZTUzNy00NGNiLWI0NTctNWI5OTJmZGFjNTNlbxq'; // for uat w/ nginx
    // return 'xxxhand';
  }

  static randomObjectId() {
    return new Types.ObjectId().toString();
  }

  static randomSeconds() {
    const random = Math.floor(Math.random() * _SECONDS.length);
    return _SECONDS[random];
  }

  /**
   * 
   * @param {object} opt
   * @param {string} opt.url
   * @param {object} opt.data
   * @returns {object} jsonData 
   */
  static async tryPostJson(opt = { url: '', data: {} }) {
    const option = {
      body: JSON.stringify(opt.data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    try {
      const res = await nodeFetch(opt.url, option);
      return res.json();
    } catch (ex) {
      console.log(ex);
      return {
        code: 500,
        message: ex.message,
      }
    }
  }
}

module.exports = AppHelper;
