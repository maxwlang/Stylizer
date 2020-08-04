const { exec, } = require('child_process');
const events = require('events');
const os = require('os');

/**
 * Spawns a websocket python server so we can comminucate with neural net processes.
 * @returns {Promise} - Returns a promise with an object of event emitter, process
 */
function spawnPythonWebsocketServer() {

    const promise = new Promise((res, rej) => {

        const emitter = new events.EventEmitter();
        const process = exec(`./src/modules/neural-bridge/bin/${(os.platform === 'win32' ? 'launch.bat' : 'socket-server.py')}`, (err, stdout, stderr) => {
            if (err) rej(new Error(err));

            emitter.emit('stdout', stdout);
            emitter.emit('stderr', stderr);

            res(({
                emitter,
                process,
            }));
        });
    });

    return promise;
}

module.exports = spawnPythonWebsocketServer;
