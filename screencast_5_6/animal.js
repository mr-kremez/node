var log = require('./logger')(module);
function Animal(nickname) {
    this.nickname = nickname;
}

Animal.prototype.introduction = function() {
    console.log('My nick is ' + this.nickname);
};

log('Add Animal to global space');
global.Animal = Animal;