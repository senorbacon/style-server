var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// main model
var Job = new Schema({
  _id             : String,
  userId          : Number,
  state: {
    type          : String,
    enum          : ['NEW','STARTED','COMPLETED','PAUSED','FAILED'],
    default       : 'NEW'
  },
  created         : Date,
  startTime       : Date,
  endTime         : Date,
  serverId        : String,
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
