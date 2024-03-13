import { server as WebSocketServer } from 'websocket';
import { requestFunction } from './init.js';
import { createServer } from 'http';

const createSocket = (port) => {

    var server = createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
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