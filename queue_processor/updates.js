var config = require('../config');
var sqs = require('../sqs/sqs.js');
var Server = require('../models/server');
var Job = require('../models/job');

function setServerState(serverId, state) {
    // set server.status
    return Server.findOne({ instanceId: serverId }).exec().then( (server) => {
        if (!server) {
            throw new Error(event.type + ": Can't find server " + serverId);
        } else {
            return server.setState(state).then(() => {
                console.log("Server " + serverId + " is now " + state + ".");
            })
        }
    });
}

module.exports.serverOnline = function(event) {
    // create server if doesn't exist
    return Server.findOne({ instanceId: event.fromServer }).exec().then( (server) => {
        if (server) {
            return server.setState(constants.SERVER_ONLINE).then(() => {
                console.log("Server " + event.fromServer + " is now " + state + ".");
            })
        } else {
            var server = new Server({
               _id: event.fromServer,
               state: constants.SERVER_ONLINE
            });
            return server.save().then(() => {
                console.log("Server " + event.fromServer + " created.");
            })
        }
    });
}

module.exports.serverOffline = function(event) {
    return setServerState(event.fromServer, constants.SERVER_OFFLINE);
}

module.exports.serverReady = function(event) {
    return setServerState(event.fromServer, constants.SERVER_READY);
}

module.exports.serverKilled = function(event) {
    return setServerState(event.fromServer, constants.SERVER_KILLED);
}

module.exports.jobStarted = function(event) {
    findJobPromise = Job.findOne({ _id: event.jobId }).exec();
    findServerPromise = Server.findOne({ instanceId: event.serverId }).exec();

    return when.join(findJobPromise, findServerPromise).then( (fulfilled) => {
        job = fulfilled[0];
        server = fulfilled[1];
        if (!job) {
            throw new Error(event.type + ": Can't find job " + event.jobId);
        } else if (!server) {
            throw new Error(event.type + ": Can't find server " + event.serverId);
        } 
        return when.join(job.setJobStarted(event.serverId), server.setJobStarted());
    });
}

module.exports.jobFinished = function(event) {
    findJobPromise = Job.findOne({ _id: event.jobId }).exec();
    findServerPromise = Server.findOne({ instanceId: event.serverId }).exec();

    return when.join(findJobPromise, findServerPromise).then( (fulfilled) => {
        job = fulfilled[0];
        server = fulfilled[1];
        if (!job) {
            throw new Error(event.type + ": Can't find job " + event.jobId);
        } else if (!server) {
            throw new Error(event.type + ": Can't find server " + event.serverId);
        } 
        return when.join(job.setJobFinished(), server.setJobFinished(job));
    });
}

module.exports.jobRequestFailed = function(event) {
    return Job.findOne({ _id: event.jobId }).exec().then( (job) => {
        if (!job) {
            throw new Error(event.type + ": Can't find job " + event.jobId);
        } else {
            return job.failAndRetry(constants.JOB_REQUEST_FAILED);
        }
    });
}

module.exports.downloadServerError = function(event) {
    return Job.findOne({ _id: event.jobId }).exec().then( (job) => {
        if (!job) {
            throw new Error(event.type + ": Can't find job " + event.jobId);
        } else {
            return job.failAndRetry(constants.JOB_FAILED);
        }
    });
}

module.exports.generatorRestart = function(event) {
    // nothing to do?
}

module.exports.failureThreshold = function(event) {
    // nothing to do?
    // escalate via email?
}

module.exports.jobProgress = function(event) {
    return Job.findOne({ _id: event.jobId }).exec().then( (job) => {
        if (!job) {
            throw new Error(event.type + ": Can't find job " + event.jobId);
        } else {
            return job.setProgress(event.progress);
        }
    });
}

module.exports.jobSuccess = function(event) {
    // nothing to do?  we already handle job cleanup in jobFinished
}

module.exports.jobFailed = function(event) {
    return Job.findOne({ _id: event.jobId }).exec().then( (job) => {
        if (!job) {
            throw new Error(event.type + ": Can't find job " + event.jobId);
        } else {
            return job.failAndRetry(constants.JOB_FAILED);
        }
    });
}

module.exports.jobCancelled = function(event) {
    return Job.findOne({ _id: event.jobId }).exec().then( (job) => {
        if (!job) {
            throw new Error(event.type + ": Can't find job " + event.jobId);
        } else {
            return job.setState(constants.JOB_CANCELLED);
        }
    });
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