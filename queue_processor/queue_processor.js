var config = require('../config/config.js');
var sqs = require('../sqs/sqs.js');
var constants = require('../common/constants.js');
var commands = require('./commands.js');
var updates = require('./updates.js');


if (process.argv.length != 3) {
    console.log("Usage: node app.js <queue name>");
    process.exit();
}

var queueName = process.argv[2]

var handlers = {};
handlers[constants.MSG_RETRY_GENERATE] = commands.retryGenerate;

// server status updates
handlers[constants.MSG_SERVER_ONLINE] = updates.serverOnline;
handlers[constants.MSG_JOB_STARTED] = updates.jobStarted;
handlers[constants.MSG_JOB_FINISHED] = updates.jobFinished;
handlers[constants.MSG_SERVER_BUSY] = updates.serverBusy;

// supporting service updates
handlers[constants.MSG_DOWNLOAD_SERVER_ERROR] = updates.downloadServerError;
handlers[constants.MSG_GENERATOR_RESTART] = updates.generatorRestart;
handlers[constants.MSG_GENERATOR_FAILURE_THRESHOLD] = updates.failureThreshold;

// generate request updates
handlers[constants.MSG_GENERATE_PROGRESS] = updates.generateProgress;
handlers[constants.MSG_GENERATE_SUCCESS] = updates.generateSuccess;
handlers[constants.MSG_GENERATE_FAILED] = updates.generateFailed;
handlers[constants.MSG_GENERATE_CANCELLED] = updates.generateCancelled;
handlers[constants.MSG_CANCEL_FAILED] = updates.cancelFailed;
handlers[constants.MSG_INVALID_CANCEL_REQ] = updates.invalidCancelReq;
handlers[constants.MSG_CANCEL_IGNORED] = updates.cancelIgnored;

// start the server once everything's ready to go
sqs.init().done(() => {
    start();
}, e => {
    console.log("Couldn't start queue processor: " + e);
});

function start() {
    console.log("Starting queue processor for queue " + queueName);
}