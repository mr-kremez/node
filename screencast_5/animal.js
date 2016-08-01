function Animal(nickname) {
    this.nickname = nickname;
}

Animal.prototype.introduction = function() {
    console.log('My nick is ' + this.nickname);
};

console.log('Add Animal to global space');
global.Animal = Animal;