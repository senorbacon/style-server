var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// model dependencies
//var Check            = require('./check');

// main model
var Server = new Schema({
  instanceId     : String,
  created        : Date,
  state          : Number,
  idleTime       : Number,
  busyTime       : Number,
});

Server.index({ instanceId: 1 }, { unique: true });
//Server.plugin(require('mongoose-lifecycle'));

Server.methods.addBusyTime = function(time, callback) {
  var firstTested = Infinity;
  this.getChecks(function(err, checks) {
    checks.forEach(function(check) {
      if (!check.firstTested) return;
      firstTested = Math.min(firstTested, check.firstTested);
    });
    callback(err, firstTested);
  });
};

module.exports = mongoose.model('Server', Server);
