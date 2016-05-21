var childProcess = require("child_process");
var config = require('../config/config.js');

var generator = null;

var restarts = 0;
var restart_threshold = config.restart_threshold;

module.exports.send = function(msg) {
    if (generator) {
        generator.send(msg);
        return true;
    } else {
        // TODO: signal to queue to retry the generator command
        console.log("generator process went away - retry request");
        return false;
    }
}

var start = function() {
    generator = childProcess.fork("./src/generate");

    generator.on('close', (code) => {
        if (restarts++ < restart_threshold) {
            start();
        } else {
            // TODO: signal to queue that couldn't keep generator process open
            console.log("Couldn't keep generator process open! Restarted " + restart_threshold + " times.")
            process.exit();
        }
    });
}

start();

