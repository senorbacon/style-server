var mongoose   = require('mongoose');
var config     = require('../config');
var when       = require('when');

// return a promise that fulfills with the mongoose object once we're connected
mongoose.myInit = function() {
  return when.promise(function(resolve, reject) {
    // configure mongodb
    mongoose.connect(config.mongodb.connectionString || 'mongodb://' + config.mongodb.user + ':' + config.mongodb.password + '@' + config.mongodb.server +'/' + config.mongodb.database);

    mongoose.connection.on('error', function (err) {
      reject(err);
    });
    mongoose.connection.on('open', function (err) {
      mongoose.connection.db.admin().serverStatus(function(err, data) {
        if (!err) {
          console.log("Connected to mongo");
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
  });
};

module.exports = mongoose;
