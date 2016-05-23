var express = require('express');
var config = require('../config/config.js');
var routes = require('./routes.js');
var bodyParser = require('body-parser');

var app = express();
var PORT = config.server_port || 3000;

// TODO: get server id from AWS
var server_id = "1";

app.set('etag', false);
app.use(bodyParser.json());

app.post('/generate', routes.generate);
app.post('/cancel', routes.cancel);

app.listen(PORT, function () {
    console.log("Style server [" + server_id + "] listening on port " + PORT);
});
