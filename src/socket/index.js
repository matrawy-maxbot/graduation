import { server as WebSocketServer } from 'websocket';
import { requestFunction } from './init.js';
import { createServer } from 'http';
import statusCodes from '../config/status.js';

const createSocket = (port) => {

    var server = createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(statusCodes.OK);
        response.end();
    });

    server.listen(port, function() {
        console.log((new Date()) + ' Server is listening on port ' + port);
    });

    const wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    wsServer.on('request', requestFunction);

}

export { createSocket };