require("./animal");
var User = require("./user");
var db = require("./db");
db.connect();

function run() {
    var vasya = new User('Vasya');
    var petia = new User('Petia');

    vasya.hello(petia);

    var testAnimal = new Animal('Test');

    testAnimal.introduction();
}

if (module.parent) {
    exports.run = run;
} else {
    run();
}