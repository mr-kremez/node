var util = require('util');
var phrases = { "Hello": "Привет", "world": "мир" };

function PhraseError(message) {
    this.message = message;
    Error.captureStackTrace(this, PhraseError);
}
util.inherits(PhraseError, Error);

function HttpError(status, message) {
    this.status = status;
    this.message = message;
    Error.captureStackTrace(this,HttpError);
}
util.inherits(HttpError, Error);

function makePAge(url) {
    if (url != 'index.html') {
        throw new HttpError(404, 'Page not found');
    }
    return util.format("%s, %s!", getPhrase('Hellos'), getPhrase('world'));
}

function getPhrase(name) {
    if (!phrases[name]) {
        throw new PhraseError('There are no such a phrase: ' + name);
    }
    return phrases[name];
}

try {
    var page = makePAge('index.html');
    console.log(page)
} catch (e) {
    if (e instanceof HttpError) {
        console.log(e.status, e.message);
    } else {
        console.log("Error %s\n messae %s\n stack: %s", e.name, e.message, e.stack);
    }
}
