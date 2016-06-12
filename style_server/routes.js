var fs = require('fs');
var AWS = require('aws-sdk'); 
var when = require('when');
var node = require('when/node');
var httpStatus = require('http-status-codes');
var interface = require('./interface.js');
var sqs = require('../sqs/sqs.js');
var config = require('../config');

var s3 = new AWS.S3({apiVersion: '2006-03-01'}); 

/**
 * Generate an image.
 * Validate the request, download the images from S3,
 * then kick off the command.
 */
module.exports.generate = function(req, res) {
    var event = {
        command: "generate",
        data: req.body || req.query
    }

    console.log(JSON.stringify(req.body));

    if (!validate(event)) {
        status = httpStatus.BAD_REQUEST;
        res.status(status).send();
        return;
    }

    when.join(
        downloadImage(event.data.styleImage),
        downloadImage(event.data.contentImage)
    ).done(() => {
        if (interface.send(event)) {
            res.status(httpStatus.OK).send();
        } else {
            console.log("generate request failed since interface process is unavailable");
            
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_GENERATE_CMD, config.serverId, constants.MSG_RETRY_GENERATE, event.data).complete(() => {
                status = httpStatus.SERVICE_UNAVAILABLE;
                res.status(status).send();
            });
        } 
    }, e => {
        console.log("fail downloading images: " + e)
        event.data._error = e;
        sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_DOWNLOAD_SERVER_ERROR, event.data).complete(() => {
            status = httpStatus.INTERNAL_SERVER_ERROR;
            res.status(status).send();
        });
    });
}

/**
 * Cancel an ongoing image generation.
 * Validate the request, then cancel.
 */
module.exports.cancel = function(req, res) {
    status = httpStatus.OK;

    event = {
        command: "cancel",
        data: req.body || req.query
    }

    if (!validate(event)) {
        status = httpStatus.BAD_REQUEST;
    }

    // if interface went away, there's nothing to cancel so this always returns OK 
    // but log it if so
    if (!interface.send(event)) {
        console.log("cancel request ignored since interface process is unavailable");
        sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, config.serverId, constants.MSG_CANCEL_FAILED, event.data);
    }

    res.status(status).send();
}


/**
 * Validate the request
 */
function validate(msg) {
    var result = true;
    var command = msg.command || '';
    var data = msg.data;

    if (!data.requestId) {
        console.log("Missing parameter requestId");
        return false;
    }

    if (!data.userId) {
        console.log("Missing parameter userId");
        return false;
    }

    switch (command) {
        case 'generate': {
            if (!data.styleImage) {
                console.log("Missing parameter styleImage");
                return false;
            }
            if (!data.contentImage) {
                console.log("Missing parameter contentImage");
                return false;
            }
            
        }
    }
    return true;
}

// convert writeFile into a thenable
var writeFile = node.lift(fs.writeFile);

/**
 * Return a promise that when fulfilled, will write the S3 object
 * a temporary storage.
 */
function downloadImage(imageName) {
    var params = {
        "Bucket": config.bucketPublic,
        "Key": imageName
    };

    var promise = when(s3.getObject(params).promise()).then(
        function(data) {
            console.log("Got image " + imageName + ", size " + data.ContentLength);
            return writeFile(config.tmpDir + params.Key, data.Body);
        }
    );

    return promise;
}
