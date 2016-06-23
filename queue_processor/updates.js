var config = require('../config');
var sqs = require('../sqs/sqs.js');
var Server = require('../models/server');

module.exports.serverOnline = function(event) {
    // create server if doesn't exist
    // set status to online
/*    
  Server.find({ instanceId: event.instanceId }).done( (instanceId) => {
    console.log("found server with ID " + event.instanceId)
  });
*/
}

module.exports.jobStarted = function(event) {
    // look up job, set status, timestamp, and server
}

module.exports.jobFinished = function(event) {
    // look up job, set status and timestamp
    // set busy time of server
}

// TODO: rename this to jobRequestFailed
module.exports.serverBusy = function(event) {
    // look up job, set status to failed
    // retry job
}

module.exports.downloadServerError = function(event) {
    // look up job, set status to failed
    // retry job?
}

module.exports.generatorRestart = function(event) {
    // nothing to do?
}

module.exports.failureThreshold = function(event) {
    // nothing to do?
    // escalate via email?
}

module.exports.jobProgress = function(event) {
    // look up job, set status, progress
    // add progress image to array
}

module.exports.jobSuccess = function(event) {
    // look up job, set status
}

module.exports.jobFailed = function(event) {
    // look up job, set status
}

module.exports.jobCancelled = function(event) {
    // look up job, set status
}

module.exports.cancelFailed = function(event) {
    // nothing to do?
    // escalate via email?
}

module.exports.invalidCancelReq = function(event) {
    // nothing to do?
    // escalate via email?
}

module.exports.cancelIgnored = function(event) {
    // nothing to do?
}