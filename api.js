var express = require('express');
var httpStatus = require('http-status-codes');
var launcher = require('./src/launcher.js');
var config = require('./config/config.js');

var app = express();
var port = 3000;

// TODO: get server id from AWS
var server_id = "1";

app.set('etag', false);

// TODO: switch to POST
app.get('/generate', function(req, res) {
    status = httpStatus.OK;

    data = req.body || req.query;
    if (!launcher.send({'generate': data})) {
        status = httpStatus.SERVICE_UNAVAILABLE;
    }

    res.status(status).send();
});

// TODO: switch to POST
app.get('/cancel', function(req, res) {
    status = httpStatus.OK;

    data = req.body || req.query;

    // if launcher went away, there's nothing to cancel so this always returns OK 
    // but log it if so
    if (!launcher.send({'cancel': data})) {
        console.log("cancel request ignored since launcher process is unavailable");
        //TODO: signal that cancel failed since the launcher process went away
    }

    res.status(status).send();
})

app.listen(port, function () {
    console.log("Style server [" + server_id + "] listening on port " + port);
});
