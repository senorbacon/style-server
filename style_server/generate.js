var childProcess = require("child_process");
var config = require('../config');
var sqs = require('../sqs/sqs.js');

process.chdir(__dirname);

var child = null;

var command = config.command;
var args = config.args.split(';');

var sqsReady = sqs.init();

process.on('message', function(event) {
    sqsReady.then(() => {
        var command = event.command || '';
        var data = event.data;

        switch (command) {
            case 'generate': 
                generate(data);
                break;

            case 'cancel': 
                cancel(data);
                break;

            default: {
                console.log("unknown command");
            }
        }
    });
});

function generate(data) {
    if (!child) {
        console.log(`Got generate command, spawning ${command} ` + args.join(' '))

        child = childProcess.spawn(command, args);

        child.customData = data;

        child.stdout.on('data', (output) => {
            console.log(`stdout: ${output}`);
            //TODO: detect progress
            var progress = 0;
            //TODO: upload partial image
            //var progressImage = ...
            //var bucket = ...
            //var s3ObjectName = ...
            //uploadImage(progressImage, bucket, s3ObjectName).then(() => {
                data.progress = progress;
                data.bucket = bucket;
                data.s3ObjectName = s3ObjectName;
                sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_JOB_PROGRESS, data);
            //}) 
        });

        child.on('close', (code) => {
            if (code == 0) {
                // TODO: did we upload the final image in the progress code?
                // TODO: if not, we need to do it here
                sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_JOB_SUCCESS, data);
                console.log("generate process succeeded");
            } else {
                data.err_code = code;
                sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_JOB_FAILED, data);
                console.log(`generate process exited with code ${code}`);
            }
            child = null;
            console.log(`Request ${data.requestId} has finished processing.`);
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_JOB_FINISHED, data);
        });

        console.log(`Request ${data.requestId} has started processing.`);
        sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_JOB_STARTED, data);
    } else {
        console.log("generate request failed, server busy");
        sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_SERVER_BUSY, data);
    }
}

function cancel(data) {
    if (child) {
        if (child.customData.requestId == data.requestId) {
            child.kill();
            console.log("generate process cancelled");
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_JOB_CANCELLED, data);
        } else {
            console.log("did not cancel generate process, requestIDs did not match");
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_INVALID_CANCEL_REQ, data);
        }
    } else {
        console.log("cancel request ignored since generate process already went away");
        sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_CANCEL_IGNORED, data);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err.message + "\n" + err.stack);
});
