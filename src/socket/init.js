import { checkRequest } from './config.js';
import { listenSocketRequest } from './events.js';

const requestFunction = async (request) => {
    try {

        const requestOwner = await checkRequest(request).catch(err => {if(err) console.error(err);return false;});
        if(!requestOwner) return;

        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' accepted.');

        connection.owner = requestOwner;

        listenSocketRequest(connection, request);

        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                //connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                //connection.sendBytes(message.binaryData);
            }
        });

        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
        
    } catch (error) {
        console.error(error);
    }
};

export { requestFunction };