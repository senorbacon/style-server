var config = require('../config');
var sqs = require('../sqs/sqs.js');
var Server = require('../models/server');

module.exports.serverOnline = function(event) {
  Server.find({ instanceId: event.instanceId }).done( (instanceId) => {
    console.log("found server with ID " + event.instanceId)
  });
}

module.exports.jobStarted = function(event) {
}

module.exports.jobFinished = function(event) {
}

module.exports.serverBusy = function(event) {
}

module.exports.downloadServerError = function(event) {
}

module.exports.failureThreshold = function(event) {
}

module.exports.generateProgress = function(event) {
}

module.exports.generateSuccess = function(event) {
}

module.exports.generateFailed = function(event) {
}

module.exports.cancelFailed = function(event) {
}

module.exports.invalidCancelReq = function(event) {
}

module.exports.cancelIgnored = function(event) {
}

module.exports.serverOnline = function(event) {
}

module.exports.serverOnline = function(event) {
}

