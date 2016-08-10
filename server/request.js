var url = require('url');
var log = require('./log')(module);

module.exports = function(req, res) {
    log.info(req.method, req.url);

    var urlParsed = url.parse(req.url, true);
    log.debug(req.headers);

    if (urlParsed.pathname == '/echo' && urlParsed.query.message) {
        res.setHeader('Cache-control', 'no-cache');
        res.end(urlParsed.query.message);
    } else {
        log.error('Unknown URL');
        res.statusCode = 404;
        res.end('Page not found');
    }
};