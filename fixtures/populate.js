var mongoose = require('../models/bootstrap');
var when = require('when');
var constants = require('../lib/constants');

var Server;
var Job;
var Event;

mongoose.myInit().done(() => {
  Server = require('../models/server');
  Job = require('../models/job');
  Event = require('../models/event');
  start();
}, e => {
  console.log("Couldn't create fixtures: " + e);
});

function start() {
  removeData().then(() => {
    return when.all([
      createServers(),
      createJobs(),
      createEvents()
    ])
  }).done(() => {
    process.exit();
  }, (e) => {
    console.log(e);
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
  ]).catch((e) => {
    console.log("Trouble creating servers: " + e)
  });
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

var createJobs = function() {
  return when.all([
    createDummyJob(1, 'NEW', Date.now(), null, null, 3),
    createDummyJob(1, 'STARTED', Date.now(), null, 'dummy-4', 4),
    createDummyJob(1, 'COMPLETED', Date.now() - 1000 * 60 * 60, Date.now(), 'dummy-3', 12),
    createDummyJob(1, 'PAUSED', Date.now() - 1000 * 60 * 60 * 3, null, 'dummy-1', 1),
    createDummyJob(1, 'FAILED', Date.now() - 1000 * 60 * 60 * 5, null, 'dummy-1', 8),
  ]).catch((e) => {
    console.log("Trouble creating jobs: " + e)
  });
};

var createDummyJob = function(user_id, state, startTime, endTime, serverId, tokens) {
  console.log('Creating Job');
  var job = new Job({
    user_id: user_id,
    state: state,
    created: Date.now(),
    startTime: startTime,
    endTime: endTime,
    serverId: serverId,
    tokens: tokens
  });
  return job.save();
};


var createEvents = function() {
  return when.all([
    createDummyEvent("dummy-1", constants.MSG_SERVER_CREATED, null, Date.now()),
    createDummyEvent("dummy-2", constants.MSG_SERVER_CREATED, null, Date.now()),
    createDummyEvent("dummy-3", constants.MSG_SERVER_CREATED, null, Date.now()),
    createDummyEvent("dummy-4", constants.MSG_SERVER_CREATED, null, Date.now()),
    createDummyEvent("dummy-5", constants.MSG_SERVER_CREATED, null, Date.now()),
    createDummyEvent("dummy-2", constants.MSG_SERVER_ONLINE, null, Date.now()),
  ]).catch((e) => {
    console.log("Trouble creating events: " + e)
  });
};

var createDummyEvent = function(fromServer, type, data, processed) {
  console.log('Creating Event');

  var event = new Event({  
    fromServer: fromServer,
    type: type,
    data: data,
    processed: processed,
    created: Date.now()
  });
  return event.save();
};

