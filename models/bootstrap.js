var mongoose   = require('mongoose');
var config     = require('../config');
var when       = require('when');
var autoIncrement = require('mongoose-auto-increment');

var initPromise;

// return a promise that fulfills with the mongoose object once we're connected
function initMongoose() {
  var connection;
  console.log("connecting to mongo");

  return when.promise(function(resolve, reject) {
    connection = mongoose.connect(config.mongodb.connectionString || 'mongodb://' + config.mongodb.user + ':' + config.mongodb.password + '@' + config.mongodb.server +'/' + config.mongodb.database);

    mongoose.connection.on('error', function (err) {
      reject(err);
    });
    mongoose.connection.on('open', function (err) {
      mongoose.connection.db.admin().serverStatus(function(err, data) {
        if (!err) {
          resolve(mongoose);
        } else {
          if (err.name === "MongoError" && (err.errmsg === 'need to login' || err.errmsg === 'unauthorized') && !config.mongodb.connectionString) {
            console.log('Forcing MongoDB authentication');
            mongoose.connection.db.authenticate(config.mongodb.user, config.mongodb.password, function(err) {
              if (!err) {
                console.log("Connected to mongo after forced auth");
                resolve(mongoose);
              } else {
                reject(err);
              }
            });
          } else {
            reject(err);
          }
        }
      });
    });
  }).then(() => {
    console.log("mongoose connected");
    mongoose.Promise = when;
    autoIncrement.initialize(connection);
  });
};

mongoose.myInit = function() {
  if (!initPromise)
    initPromise = initMongoose();

  return initPromise;
}

module.exports = mongoose;
