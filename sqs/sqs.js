var AWS = require('aws-sdk'); 
var when = require('when');

var sqs = new AWS.SQS({apiVersion: '2012-11-05', region: "us-west-2"});

module.exports.QUEUES = {
    STYLE_GENERATE_CMD: null,
    STYLE_CANCEL_CMD: null,
    STYLE_UPDATE: null
}

/**
 * Load all queueURLs
 */
module.exports.init = function loadQueueUrls() {
    var promises = [];

    // get a promise for each queue in our QUEUEs array
    Object.keys(module.exports.QUEUES).forEach(function(key) {
        promises.push(loadQueueUrl(key));
    });

    // get a promise that's only fulfilled once everything in the array is
    // fulfilled, then set the Queue URLs
    return when.all(promises).then(function(queueUrls) {
        queueUrls.forEach(function(data) {
            module.exports.QUEUES[data.queueName] = data.queueUrl;
        });
        console.log("Got Queue URLs");
    }).catch(e => {
        console.log("Could not load SQS queue URLs: " + e);
        process.exit();
    });
}

module.exports.sendQueueMessage = function (queueUrl, serverId, type, data) {
    if (!queueUrl)
        throw new Error("Invalid Queue URL " + queueUrl);

    var payload = {
        server: serverId,
        type: type,
        data: data
    };

    var params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload)
    };

    return when(sqs.sendMessage(params).promise());
}

function loadQueueUrl(queueName) {
    var params = {
        QueueName: queueName
    };

    var promise = when(sqs.getQueueUrl(params).promise()).then(
        function(data) {
            return {queueName: queueName, queueUrl: data.QueueUrl};
        }
    );

    return promise;
}   