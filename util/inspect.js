var util = require('util');

var obj = {
    a: 5,
    b: function () {
        return 5;
    },
    inspect: function() {
        return 'Custom inspect';
    }
};

console.log(util.inspect(obj));

