var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var sqs = require('../sqs/sqs.js');

var constants = require('../lib/constants');

// main model
var Job = new Schema({
  _id             : String,
  userId          : Number,
  state: {
    type          : String,
    enum          : [constants.JOB_NEW, constants.JOB_STARTED, constants.JOB_COMPLETED, constants.JOB_PAUSED, constants.JOB_FAILED, constants.JOB_IN_PROGRESS, constants.JOB_REQUEST_FAILED],
    default       : constants.JOB_NEW
  },
  created         : Date,
  startTime       : Date,
  endTime         : Date,
  serverId        : String,
  duration        : Number, 
  retries: {
    type          : Number,
    default       : 0
  },
  progress: {
    type          : Number,
    default       : 0
  },
  // job params
  credits         : Number
});

Job.pre('save', function(next) {
  if (!this._id) {
    this._id = Math.floor(new Date() / 1000) + '-' + Math.floor(Math.random() * 65536).toString(16);
  }

  next();
});

module.exports = mongoose.model('Job', Job);

Job.methods.setState = function(state) {
  this.state = state;
  return this.save();
}

Job.methods.setProgress = function(progress) {
  this.progress = progress;
  this.state = constants.JOB_IN_PROGRESS;
  return this.save();
}

Job.methods.failAndRetry = function(state) {
  this.state = state;
  this.retries++;
  if (this.retries >= config.jobRetryMax) {
    throw new Error("Hit retry max for job " + this._id);
  }
  retry = sqs.sendQueueMessage(sqs.QUEUES.STYLE_GENERATE_CMD, config.serverId, constants.MSG_JOB_RETRY, event); // need new event?
  return when.join(this.save(), retry);
}

Job.methods.setJobStarted = function(serverId) {
  this.state = constants.JOB_STARTED;
  this.serverId = serverId;
  this.startTime = new Date();
  return this.save();
};

Job.methods.setJobFinished = function() {
  this.state = constants.JOB_COMPLETED;
  this.endTime = new Date();
  this.duration = (this.endTime - this.startTime) / 1000;
  return this.save();
};
