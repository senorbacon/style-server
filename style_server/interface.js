var childProcess = require("child_process");
var config = require('../config');
var constants = require('../lib/constants');
var sqs = require('../sqs/sqs.js');

var generator = null;

var restarts = 0;
var restartThreshold = config.restartThreshold;

process.chdir(__dirname);

/**
 * Pass a message along to our "generator" background process,
 * which is responsible for starting or cancelling neural-style jobs
 */
module.exports.send = function(event) {
    if (generator) {
        generator.send(event);
        return true;
    } else {
        return false;
    }
}

/**
 * Start our generator background process.
 * Restart the generator if it closes for some reason, and bail out
 * if we restart so many times.
 */
var start = function() {
    generator = childProcess.fork("./generate.js");

    generator.on('close', (code) => {
        if (restarts++ < restartThreshold) {
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_GENERATOR_RESTART, restarts).complete(() => {
                console.log("Restarting closed generator process. Restarted " + restarts + " times.");
                start();
            });
        } else {
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_GENERATOR_FAILURE_THRESHOLD, restartThreshold).complete(() => {
                console.log("Couldn't keep generator process open! Restarted " + restartThreshold + " times.")
                process.exit();
            });
        }
    });
}

start();