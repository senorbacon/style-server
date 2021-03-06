if (process.argv.length != 3) {
    console.log("Usage: node queue_processor.js <queue name>");
    process.exit();
}

var Consumer = require('sqs-consumer');
var config = require('../config');
var sqs = require('../sqs/sqs');
var constants = require('../lib/constants');
var commands = require('./commands');
var updates = require('./updates');
var when = require('when');
var mongoose = require("../models/bootstrap")
var Event = require('../models/event');

var queueName = process.argv[2]

var handlers = {};

// job commands
handlers[constants.MSG_JOB_START] = commands.jobStart;
handlers[constants.MSG_JOB_RETRY] = commands.jobRetry;
handlers[constants.MSG_JOB_CANCEL] = commands.jobCancel;

// server status updates
handlers[constants.MSG_SERVER_ONLINE] = updates.serverOnline;
handlers[constants.MSG_SERVER_OFFLINE] = updates.serverOffline;
handlers[constants.MSG_SERVER_READY] = updates.serverReady;
handlers[constants.MSG_SERVER_KILLED] = updates.serverKilled;

// job status updates
handlers[constants.MSG_JOB_STARTED] = updates.jobStarted;
handlers[constants.MSG_JOB_FINISHED] = updates.jobFinished;

// supporting service updates
handlers[constants.MSG_DOWNLOAD_SERVER_ERROR] = updates.downloadServerError;
handlers[constants.MSG_GENERATOR_RESTART] = updates.generatorRestart;
handlers[constants.MSG_GENERATOR_FAILURE_THRESHOLD] = updates.failureThreshold;

// job request updates
handlers[constants.MSG_JOB_REQUEST_FAILED] = updates.jobRequestFailed;
handlers[constants.MSG_JOB_PROGRESS] = updates.jobProgress;
handlers[constants.MSG_JOB_SUCCESS] = updates.jobSuccess;
handlers[constants.MSG_JOB_FAILED] = updates.jobFailed;
handlers[constants.MSG_JOB_CANCELLED] = updates.jobCancelled;
handlers[constants.MSG_CANCEL_FAILED] = updates.cancelFailed;
handlers[constants.MSG_INVALID_CANCEL_REQ] = updates.invalidCancelReq;
handlers[constants.MSG_CANCEL_IGNORED] = updates.cancelIgnored;

// start the server once everything's ready to go
when.join(sqs.init(), mongoose.myInit()).done(() => {
    startQueueProcessor(queueName);
}, e => {
    console.log("Couldn't start server: " + e);
});

function startQueueProcessor(queueName) {
    var queueUrl = sqs.QUEUES[queueName];
    if (!queueUrl) {
        throw new Error("Invalid queue: " + queueName);
    }
    console.log("Starting queue processor for queue " + queueName);

    var app = Consumer.create({
        queueUrl: queueUrl,
        region: config.sqs.region,
        batchSize: 1,
        handleMessage: function (message, done) {
            try {
                var msgBody = JSON.parse(message.Body);
                if (!msgBody) {
                    throw new Error("Invalid JSON in message body [" + message.Body + "]");
                }
                var event = Event.hydrate(msgBody);
                var handler = handlers[event.type];
                if (!handler) {
                    throw new Error("No handler for message type [" + event.type + "]");
                }

                console.log("Handling event: " + event);
//                handler(event);
            } catch (e) {
                return done(e);
            }
            return done();
        }
    });

    app.on('error', function (err) {
      console.log(err);
    });

    app.start();
}