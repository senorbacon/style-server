var childProcess = require("child_process");
var config = require('../config');
var constants = require('../lib/constants');
var sqs = require('../sqs/sqs.js');

var generator = null;

var restarts = 0;

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
        if (restarts++ < config.restartThreshold) {
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_GENERATOR_RESTART, restarts).done(() => {
                console.log("Restarting closed generator process. Restarted " + restarts + " times.");
                start();
            });
        } else {
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_GENERATOR_FAILURE_THRESHOLD, config.restartThreshold).done(() => {
                console.log("Couldn't keep generator process open! Restarted " + config.restartThreshold + " times.")
                process.exit();
            });
        }
    });
}

start();