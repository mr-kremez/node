var mongoose = require('libs/mongoose');
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function(err, results) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {
    var users = [
        {username: 'Vasya', password: '1234'},
        {username: 'Petya', password: '1234'},
        {username: 'admin', password: '1234'}
    ];
    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}
