var Stomp = require('./src/main.js');
var StompNode = require('./src/node-stomp.js');

module.exports = Stomp.Stomp;
module.exports.overTCP = StompNode.overTCP;
module.exports.overWS = StompNode.overWS;