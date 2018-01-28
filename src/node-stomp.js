
(function() {
    var Stomp, net, overTCP, overWS, wrapTCP, wrapWS;

    Stomp = require('./main');

        net = require('net');

    Stomp.Stomp.setInterval = function(interval, f) {
        return setInterval(f, interval);
    };

    Stomp.Stomp.clearInterval = function(id) {
        return clearInterval(id);
    };

    wrapTCP = function(port, host) {
        var socket, ws;
        socket = null;
        ws = {
            url: 'tcp:// ' + host + ':' + port,
            send: function(d) {
                return socket.write(d);
            },
            close: function() {
                return socket.end();
            }
        };
        socket = net.connect(port, host, function(e) {
            return ws.onopen();
        });
        socket.on('error', function(e) {
            return typeof ws.onclose === "function" ? ws.onclose(e) : void 0;
        });
        socket.on('close', function(e) {
            return typeof ws.onclose === "function" ? ws.onclose(e) : void 0;
        });
        socket.on('data', function(data) {
            var event;
            event = {
                'data': data.toString()
            };
            return ws.onmessage(event);
        });
        return ws;
    };

    wrapWS = function(url) {
        var WebSocketClient, connection, socket, ws;
        WebSocketClient = require('websocket').client;
        connection = null;
        ws = {
            url: url,
            send: function(d) {
                return connection.sendUTF(d);
            },
            close: function() {
                return connection.close();
            }
        };
        socket = new WebSocketClient();
        socket.on('connect', function(conn) {
            connection = conn;
            ws.onopen();
            connection.on('error', function(error) {
                return typeof ws.onclose === "function" ? ws.onclose(error) : void 0;
            });
            connection.on('close', function() {
                return typeof ws.onclose === "function" ? ws.onclose() : void 0;
            });
            return connection.on('message', function(message) {
                var event;
                if (message.type === 'utf8') {
                    event = {
                        'data': message.utf8Data
                    };
                    return ws.onmessage(event);
                }
            });
        });
        socket.connect(url);
        return ws;
    };

    overTCP = function(host, port) {
        var socket;
        socket = wrapTCP(port, host);
        return Stomp.Stomp.over(socket);
    };

    overWS = function(url) {
        var socket;
        socket = wrapWS(url);
        return Stomp.Stomp.over(socket);
    };

    exports.overTCP = overTCP;

    exports.overWS = overWS;

}).call(this);