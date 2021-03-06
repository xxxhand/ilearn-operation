const { customArgvs } = require('@llearn/app-common/custom-tools');
const { LOGGER } = require('@llearn/app-common');
const SocketClient = require('./socker-client');
const AppHelper = require('./app-helper');

/**
 * @typedef RoomRef
 * @property {string} _id
 * @property {string} hostId
 */

/** @type {Array<SocketClient>} */
const _ALL_CLIENTS = [];

/**
 * @function
 * @param {number} num 
 * @returns {Array<string>} hosts
 */
function _createHosts(num = 0) {
    console.log(`Create ${num} hosts`);
    const hosts = new Set();
    for (let i = 0; i < num; i++) {
        hosts.add(AppHelper.randomObjectId());
    }
    return [...hosts];
}

/**
 * @private
 * @async
 * @function
 * @param {Array<string>} hosts 
 * @returns {Promise<Array<RoomRef>>} rooms
 */
async function _createRooms(hosts = []) {
    console.log(`create ${hosts.length} rooms`);

    /** @type {Array<RoomRef>} */
    const rooms = [];

    for await (const hid of hosts) {
        const roomRequest = await AppHelper.tryPostJson({
            url: `${AppHelper.chatDomain}/${AppHelper.createRoomApi}`,
            data: {
                hostId: hid,
                expectStartAt: new Date(),
            },
        });
        if (roomRequest.code > 0) {
            console.log(roomRequest);
            continue;
        }
        rooms.push({
            _id: roomRequest.result._id,
            hostId: roomRequest.result.hostId,
        });
    }

    return rooms;
}

/**
 * @private
 * @function
 * @async
 * @param {Array<RoomRef>} rooms
 * @returns {Promise<void>} 
 */
async function _openRooms(rooms = []) {
    let i = 0;
    for await (const room of rooms) {
        const host = new SocketClient(i)
            .useRoom(room._id)
            .useUser(room.hostId);
        try {
            await host.start();
        } catch (ex) {
            LOGGER.error(`Host ${host.index} open fail`);
            continue;
        }
        
        await host.joinRoom();
        await host.openRoom();
        // const seconds = AppHelper.randomSeconds();
        // LOGGER.info(`Send message every ${seconds} seconds`);
        // setInterval(() => host.sendMessage(host.whoami), seconds * 1000);
        i++;
    }
}

/**
 * @private
 * @function
 * @async
 * @param {Array<RoomRef>} rooms
 * @returns {Promise<void>}
 */
async function _runClients(rooms = []) {
    console.log(`Ready to run ${customArgvs.length} socket clients`);
    for (let i = 0; i < customArgvs.length; i++) {
        const random = Math.floor(Math.random() * rooms.length);

        const client = new SocketClient(i)
            .useRoom(rooms[random]._id)
            .useUser(AppHelper.randomObjectId());

        try {
            await client.start();
        } catch (ex) {
            LOGGER.info(`Client ${client.index} start fail`);
            continue;
        }
        
        await client.joinRoom();
        _ALL_CLIENTS.push(client);
        // const seconds = AppHelper.randomSeconds();
        // LOGGER.info(`Send message every ${seconds} seconds`);
        // setInterval(() => client.sendMessage(client.whoami), seconds * 1000);
    }
}

function _startToSend() {
    _ALL_CLIENTS.forEach((x) => {
        const seconds = AppHelper.randomSeconds();
        LOGGER.info(`Client ${x.index} send message every ${seconds} seconds`);
        setInterval(() => x.sendMessage(x.whoami), seconds * 1000);
    });
}

async function main() {
    LOGGER.info(`------ Start on ${new Date().toISOString()}`);
    const rooms = await _createRooms(_createHosts(customArgvs.rooms));
    console.log(rooms);
    await _openRooms(rooms);
    await _runClients(rooms);
    _startToSend();
}

main().catch((ex) => console.log(ex));