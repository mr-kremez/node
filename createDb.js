var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection");
        callback(result);
    });
};

var removeDocuments = function(db, callback) {
    var collection = db.collection('documents');
    collection.remove({}, function(err, affected) {
        if (err) throw err;
    });
};
// Connection URL
var url = 'mongodb://localhost:27017/chat';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    removeDocuments(db, function() {
        console.log('Documents were removed.')
    });

    insertDocuments(db, function() {
        console.log('Documents were created.')
        db.close();
    });
});
