"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-wolf-app';
// Port where we'll run the websocket server
const webSocketsServerPort = 1337;
// websocket and http servers
const webSocketServer = require('websocket').server;
const http = require('http');
/**
 * Global constiables
 */
// list of currently connected clients (users)
const clients = [];

/**
 * Helper function for escaping input strings
 */

const htmlEntities = (str) => {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * HTTP server
 */
const server = http.createServer(function (request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
});
server.listen(webSocketsServerPort, function () {
    console.log((new Date()) + " Server is listening on port "
        + webSocketsServerPort);
});

/**
 * WebSocket server
 */
const wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info 
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function (request) {
    console.log((new Date()) + ' Connection from origin '
        + request.origin + '.');
    // accept connection - you should check 'request.origin' to
    // make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    const connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    const index = clients.push(connection) - 1;
    const userName = false;

    console.log((new Date()) + ' Connection accepted.');
    // send back chat history

    // user sent some message
    connection.on('message', function (message) {
        if (message.type === 'utf8') { // accept only text
            // first message sent by user is their name
            if (userName === false) {
                // remember user name
                userName = htmlEntities(message.utf8Data);
                // get random color and send it back to the user
                userColor = colors.shift();
                connection.sendUTF(
                    JSON.stringify({ type: 'color', data: userColor }));
                console.log((new Date()) + ' User is known as: ' + userName
                    + ' with ' + userColor + ' color.');
            } else { // log and broadcast the message
                console.log((new Date()) + ' Received Message from '
                    + userName + ': ' + message.utf8Data);

                // we want to keep history of all sent messages
                const obj = {
                    time: (new Date()).getTime(),
                    text: htmlEntities(message.utf8Data),
                    author: userName,
                    color: userColor
                };
                history.push(obj);
                history = history.slice(-100);
                // broadcast message to all connected clients
                const json = JSON.stringify({ type: 'message', data: obj });
                for (const i = 0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
            }
        }
    });
    // user disconnected
    connection.on('close', function (connection) {
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
        }
    });
});