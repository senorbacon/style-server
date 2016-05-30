var express = require('express');
var config = require('../config/config.js');
var constants = require('../common/constants.js');
var routes = require('./routes.js');
var bodyParser = require('body-parser');
var sqs = require('../sqs/sqs.js');

var app = express();

app.set('etag', false);
app.use(bodyParser.json());

// Define our routes
app.post('/generate', routes.generate);
app.post('/cancel', routes.cancel);

// start the server once everything's ready to go
sqs.init().done(() => {
    app.listen(config.server_port, function () {
        sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, constants.MSG_SERVER_ONLINE, config.server_id)
        console.log("Style server [" + config.server_id + "] listening on port " + config.server_port);
    });
}, e => {
    console.log("Couldn't start server: " + e);
});