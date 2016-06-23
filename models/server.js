var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// model dependencies
//var Check            = require('./check');

// main model
var Server = new Schema({
  _id             : String,
  created         : Date,
  state: {
              type: String,
              enum: ['OFFLINE','ONLINE','READY','BUSY'],
           default: 'OFFLINE'
  },
  idleTime        : Number,
  busyTime        : Number,
});

//Server.plugin(require('mongoose-lifecycle'));

module.exports = mongoose.model('Server', Server);
