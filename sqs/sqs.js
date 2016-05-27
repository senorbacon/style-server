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

    Object.keys(module.exports.QUEUES).forEach(function(key) {
        promises.push(loadQueueUrl(key));
    });

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

module.exports.sendQueueMessage = function (queue, type, data) {
    var queueUrl = module.exports.QUEUES[queue];
    if (!queueUrl)
        throw new Error("Invalid Queue name " + queue);

    var params = {
        QueueUrl: queueUrl,
    };

    var promise = when(sqs.sendMessage(params).promise()).then(
        function(data) {
            console.log("Got image " + imageName + ", size " + data.ContentLength);
            return writeFile(config.tmp_dir + params.Key, data.Body);
        }
    );

    return promise;
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