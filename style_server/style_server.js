var express = require('express');
var config = require('../config');
var constants = require('../common/constants');
var routes = require('./routes');
var bodyParser = require('body-parser');
var sqs = require('../sqs/sqs');

var app = express();

app.set('etag', false);
app.use(bodyParser.json());

// Define our routes
app.post('/generate', routes.generate);
app.post('/cancel', routes.cancel);

// start the server once everything's ready to go
sqs.init().done(() => {
    app.listen(config.serverPort, function () {
        sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, constants.MSG_SERVER_ONLINE, config.serverId)
        console.log("Style server [" + config.serverId + "] listening on port " + config.serverPort);
    });
}, e => {
    console.log("Couldn't start server: " + e);
});

process.on('exit', () => {
  console.log('style server closing!');
});
