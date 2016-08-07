var util = require('util');

var str = util.format("My %s %d %j", 'str', 123, {a: 5});

console.log(str);