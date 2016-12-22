var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var constants = require('../lib/constants');

// main model
var Server = new Schema({
  _id             : String,
  created: {
    type          : Date,
    default       : Date.now() 
  },
  state: {
    type          : String,
    enum          : [constants.SERVER_OFFLINE, constants.SERVER_ONLINE, constants.SERVER_READY, constants.SERVER_BUSY, constants.SERVER_KILLED],
    default       : constants.SERVER_OFFLINE
  },
  stateChangedAt: {
    type          : Date,
    default       : Date.now() 
  }
  idleTime: {
    type          : Number,
    default       : 0
  },
  busyTime: {
    type          : Number,
    default       : 0
  },
  creditsProcessed: {
    type          : Number,
    default       : 0
  }
});

//Server.plugin(require('mongoose-lifecycle'));

module.exports = mongoose.model('Server', Server);

Server.methods.setState = function(state) {
  this.state = state;
  this.stateChangedAt = Date.now();
  return this.save();
};

Server.methods.setJobStarted = function() {
  this.idleTime += (Date.now() - this.stateChangedAt) / 1000;
  this.setState(constants.SERVER_BUSY);
};

Server.methods.setJobFinished = function(job) {
  this.creditsProcessed += job.credits;
  this.busyTime += (Date.now() - this.stateChangedAt) / 1000;
  this.setState(constants.SERVER_READY);
};
