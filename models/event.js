var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// main model
var Event = new Schema({
  _id             : Number,
  type            : String,
  processedTime   : Date,
  data            : Array
});

module.exports = mongoose.model('Event', Event);
