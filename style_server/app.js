var express = require('express');
var config = require('../config/config.js');
var routes = require('./routes.js');
var bodyParser = require('body-parser');

var app = express();

app.set('etag', false);
app.use(bodyParser.json());

app.post('/generate', routes.generate);
app.post('/cancel', routes.cancel);

app.listen(config.server_port, function () {
    // TODO: send queue msg that server_id is online and listening
    console.log("Style server [" + config.server_id + "] listening on port " + config.server_port);
});
