var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

// main model
var Event = new Schema({
  fromServer      : String,
  type            : String,
  data            : Array,
  created         : Date,
  processed       : Date,
});

Event.plugin(autoIncrement.plugin, 'Event');

module.exports = mongoose.model('Event', Event);
