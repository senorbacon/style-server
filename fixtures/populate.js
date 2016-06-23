var mongoose = require('../models/bootstrap');
var when = require('when');

var Server = require('../models/server');
var Job = require('../models/job');
var Event = require('../models/event');


mongoose.myInit().done(() => {
    start();
}, e => {
    console.log("Couldn't create fixtures: " + e);
});

function start() {
  removeData().then(() => {
    return when.all([
      createServers(),
//      createJobs(),
//      createEvents()
    ])
  }).done(() => {
    process.exit();
  });
}

var removeData = function() {
  console.log('Removing Data');
  return when.all([
    Server.collection.remove(),
    Job.collection.remove(),
    Event.collection.remove(),
  ]).finally(() => {
    console.log("Data removed");
  });
};

var createServers = function() {
  return when.all([
    createDummyServer('dummy-1', 'OFFLINE', 0, 0),
    createDummyServer('dummy-2', 'ONLINE', 0, 0),
    createDummyServer('dummy-3', 'READY', 0, 0),
    createDummyServer('dummy-4', 'BUSY', 0, 0),
  ]);
};

var createDummyServer = function(id, state, idleTime, busyTime) {
  console.log('Creating server "' + id + '"');
  var server = new Server({
    _id: id,
    created: Date.now(),
    state: state,
    idleTime: idleTime,
    busyTime: busyTime
  });
  return server.save();
};
