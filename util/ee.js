var EventEmitter = require('events').EventEmitter;

var server = new EventEmitter;

server.on('request', function(request) {
    request.approved = true;
});

server.on('request', function(request) {
    console.log(request);
});

server.emit('request', {from: 'Client'});
server.emit('request', {from: 'One more'});

console.log(server.listeners('request'));

server.on('error', function(err) {
    console.log(err.message) ;
});

server.emit('error', new Error('err message'));