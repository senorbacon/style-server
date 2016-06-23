if (process.argv.length != 3) {
    console.log("Usage: node app.js <queue name>");
    process.exit();
}

var config = require('../config');
var sqs = require('../sqs/sqs');
var constants = require('../common/constants');
var commands = require('./commands');
var updates = require('./updates');
var when = require('when');
var mongoose = require("../models/bootstrap")

var queueName = process.argv[2]

var handlers = {};

// job commands
handlers[constants.MSG_JOB_RETRY] = commands.jobRetry;

// server status updates
handlers[constants.MSG_SERVER_ONLINE] = updates.serverOnline;
handlers[constants.MSG_JOB_STARTED] = updates.jobStarted;
handlers[constants.MSG_JOB_FINISHED] = updates.jobFinished;
handlers[constants.MSG_SERVER_BUSY] = updates.serverBusy;

// supporting service updates
handlers[constants.MSG_DOWNLOAD_SERVER_ERROR] = updates.downloadServerError;
handlers[constants.MSG_GENERATOR_RESTART] = updates.generatorRestart;
handlers[constants.MSG_GENERATOR_FAILURE_THRESHOLD] = updates.failureThreshold;

// job request updates
handlers[constants.MSG_JOB_PROGRESS] = updates.jobProgress;
handlers[constants.MSG_JOB_SUCCESS] = updates.jobSuccess;
handlers[constants.MSG_JOB_FAILED] = updates.jobFailed;
handlers[constants.MSG_JOB_CANCELLED] = updates.jobCancelled;
handlers[constants.MSG_CANCEL_FAILED] = updates.cancelFailed;
handlers[constants.MSG_INVALID_CANCEL_REQ] = updates.invalidCancelReq;
handlers[constants.MSG_CANCEL_IGNORED] = updates.cancelIgnored;

// start the server once everything's ready to go
when.join(sqs.init(), mongoose.myInit()).done(() => {
    start();
}, e => {
    console.log("Couldn't start server: " + e);
});

function start() {
    console.log("Starting queue processor for queue " + queueName);
}