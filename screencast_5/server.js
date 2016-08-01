require("./animal");
var user = require("./user");

var vasya = new user.User('Vasya');
var petia = new user.User('Petia');

vasya.hello(petia);

var testAnimal = new Animal('Test');

testAnimal.introduction();
