var childProcess = require("child_process");
var config = require('../config/config.js');

(function() {
    var generate = null;

    var restarts = 0;
    var restart_threshold = config.restart_threshold;

    var restart = function() 
    {
        generate = childProcess.fork("./src/generate");

        generate.on('close', (code) => {
            if (restarts++ < restart_threshold) {
                restart();
            } else {
                // TODO: signal to queue that couldn't keep generate process open
                console.log("Couldn't keep generate process open! Restarted " + restart_threshold + " times.")
                process.exit();
            }
        });
    }

    module.exports.send = function(data)
    {
        if (generate) {
            generate.send(data);
            return true;
        } else {
            // TODO: signal to queue to retry the generate command
            console.log("generate process went away - retry request");
            return false;
        }
    }

    restart();
})();

