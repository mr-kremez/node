var log = require('libs/log')(module);
var config = require('config');
var connect = require('connect');
var async = require('async');
var cookieParser = require('cookie-parser');
var sessionStore = require('libs/sessionStore');
var HttpError = require('error').HttpError;
var User = require('models/user').User;

function loadSession(sid, callback) {
    sessionStore.load(sid, function(err, session) {
        if (arguments.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });

}

function loadUser(session, callback) {

    if (!session.user) {
        log.debug("Session %s is anonymous", session.id);
        return callback(null, null);
    }

    log.debug("retrieving user ", session.user);

    User.findById(session.user, function(err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }
        log.debug("user findbyId result: " + user);
        callback(null, user);
    });

}

module.exports = function(server) {
    var io = require('socket.io')(server);
    io.origins('localhost:*');
    var secret = config.get('session:secret');
    var sessionKey = config.get('session:key');

    io.use(function(socket, callback) {
        var handshakeData = socket.request;
        async.waterfall([
            function(callback) {
                var parser = cookieParser(secret);
                parser(handshakeData, {}, function (err) {
                    if (err) return callback(err);

                    var sid = handshakeData.signedCookies[sessionKey];

                    console.error(sid);

                    loadSession(sid, callback);
                });
            },
            function(session, callback) {

                if (!session) {
                    callback(new HttpError(401, "No session"));
                }

                socket.handshake.session = session;
                loadUser(session, callback);
            },
            function(user, callback) {
                if (!user) {
                    return callback(new HttpError(403, "Anonymous session may not connect"));
                }

                socket.handshake.user = user;
                callback(null);
            }

        ], function(err) {
            if (!err) {
                return callback(null, true);
            }

            if (err instanceof HttpError) {
                return callback(null, false);
            }

            callback(err);
        });

    });

    io.on('connection', function(socket) {

        var username = socket.handshake.user.get('username');

        socket.broadcast.emit('join', username);

        socket.on('message', function(text, cb) {
            socket.broadcast.emit('message', username, text);
            cb && cb();
        });

        socket.broadcast.on('disconnect', function() {
            socket.broadcast.emit('leave', username);
        });

    });

    return io;
};
