const { io } = require('socket.io-client');
const pEvent = require('p-event');
const AppHelper = require('./app-helper');

class SocketClient {
  constructor(i) {
    this.index = i;
    this._client = null;
    this._userId = '';
    this._userName = '';
    this._roomId = '';
  }

  get whoami() {
    return this._userName;
  }

  /**
   * 
   * @param {string} id 
   * @returns {SocketClient} this
   */
  useUser = (id = '') => {
    this._userId = id;
    this._userName = `stress-${this._userId}`;
    return this;
  }

  /**
   * 
   * @param {string} id 
   * @returns {SocketClient} this
   */  
  useRoom = (roomId = '') => {
    this._roomId = roomId;
    return this;
  } 

  /**
   * @returns {void}
   */
  start = async () => {
    console.log(`Starting number ${this.index} client`);
    this._client = io(`${AppHelper.chatDomain}/${AppHelper.chatRoomNameSpace}`, {
      query: {
        id: AppHelper.rootCA,
      },
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: false,
    }).connect();
    this._client.on('connect', this._onConnect);
    this._client.on('connect_err', this._onConnectError);
    this._client.on('data', this._onData);
    return new Promise((res) => {
      this._client.once('connect', () => {
        res();
      });
    });
  }

  joinRoom = async () => {
    this._client.emit('join-chat-room', {
      chatRoomId: this._roomId,
      userId: this._userId,
      userName: this._userName,
    });
    await pEvent(this._client, 'join-chat-room-res');
  }

  openRoom = async () => {
    this._client.emit('open-chat-room', {
      chatRoomId: this._roomId,
    });
    await pEvent(this._client, 'open-chat-room-res');
  }

  /**
   * 
   * @param {string} msg
   * @returns {void} 
   */
  sendMessage = (msg = '') => {
    console.log(`User ${this._userName} send ${msg} to room ${this._roomId}`);
    this._client.emit('send-message', {
      chatRoomId: this._roomId,
      userId: this._userId,
      userName: this._userName,
      content: msg,
    });
  }

  /**
   * @returns {void}
   */  
  stop = () => {
    if (this._client) {
      console.log(`Number ${this.index} closing...`);
      this._client.close();
    }
  }

  _onConnect = () => {
    console.log(`Number ${this.index} was connected...`);
  }
  _onConnectError = (err) => {
    console.log('Connect to server error');
    console.log(err);
  }
  _onData = (data) => {
    console.log(`Number ${this.index} recevie data ${JSON.stringify(data)}`);
  }
}

module.exports = SocketClient;
