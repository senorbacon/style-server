var express = require('express');
var childProcess = require("child_process");

var app = express();
var port = 3000;
var restarts = 0;
var restart_threshold = 20;

// TODO: get server id from AWS
var server_id = "1";

var child = childProcess.fork("./src/generate");
child.on('close', (code) => {
    if (restarts++ < restart_threshold) {
        child = childProcess.fork("./src/generate");
    } else {
        // TODO: signal to queue that couldn't keep generate process open
        console.log("Couldn't keep generate process open! Restarted " + restart_threshold + " times.")
        process.exit();
    }
});

// TODO: switch to POST
app.get('/generate', function(req, res) {
    busy = true;
    // TODO: send BUSY signal to AWS Queue

    data = req.body || req.query;

    if (child) {
        child.send({'generate': data});
    } else {
        // TODO: signal to queue to retry the generate command
        console.log("retry the generate request");
    }

    res.send();
});

// TODO: switch to POST
app.get('/cancel', function(req, res) {
    child.send({'cancel': data});
    res.send();
})

app.listen(port, function () {
    console.log("Style server [" + server_id + "] listening on port " + port);
});
