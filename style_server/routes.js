var fs = require('fs');
var AWS = require('aws-sdk'); 
var when = require('when');
var node = require('when/node');
var httpStatus = require('http-status-codes');
var interface = require('./interface.js');
var sqs = require('../sqs/sqs.js');
var config = require('../config/config.js');

var s3 = new AWS.S3({apiVersion: '2006-03-01'}); 

var writeFile = node.lift(fs.writeFile);

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
    ).then(function() {
        if (interface.send(event)) {
            res.status(httpStatus.OK).send();
        } else {
            console.log("generate request failed since interface process is unavailable");
            // TODO: signal to queue to retry the generator command
            sqs.sendQueueMessage(sqs.QUEUES.STYLE_UPDATE, sqs.MESSAGES.UPDATE_GENERATE_REQ, event.data).complete(() => {
                status = httpStatus.SERVICE_UNAVAILABLE;
                res.status(status).send();
            });
        } 
    }).catch(
        e => {
            console.log("fail downloading images: " + e)
            // TODO: signal that request failed due to server error
            status = httpStatus.INTERNAL_SERVER_ERROR;
            res.status(status).send();
        }
    )
}

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
        //TODO: signal that cancel failed since the interface process went away
    }

    res.status(status).send();
}

function validate(msg) {
    var result = true;
    var command = msg.command || '';
    var data = msg.data;

    if (!data.requestId) {
        console.log("Missing parameter requestId");
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

function downloadImage(imageName) {
    var params = {
        "Bucket": config.bucket_public,
        "Key": imageName
    };

    var promise = when(s3.getObject(params).promise()).then(
        function(data) {
            console.log("Got image " + imageName + ", size " + data.ContentLength);
            return writeFile(config.tmp_dir + params.Key, data.Body);
        }
    );

    return promise;
}
