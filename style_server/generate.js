var childProcess = require("child_process");
var config = require('../config/config.js');

var child = null;

var command = config.command;
var args = config.args;

process.on('message', function(event) {
    var command = event.command || '';
    var data = event.data;

    switch (command) {
        case 'generate': 
            generate(data);
            break;

        case 'cancel': 
            cancel(data);
            break;

        default: {
            console.log("unknown command");
        }
    }
});

function generate(data) {
    if (!child) {
        child = childProcess.spawn(command, args);

        console.log(`Got generate command, spawning ${command} ` + args.join(' '))

        // TODO: send SERVER_BUSY signal to AWS Queue

        child.customData = data;

        child.stdout.on('data', (output) => {
            console.log(`stdout: ${output}`);
            //TODO: detect progress
            //TODO: signal to AWS queue that request ID {data.requestId} is at progress x%
        });

        child.on('close', (code) => {
            if (code == 0) {
                //TODO: signal to AWS queue that request ID {data.requestId} succeeded
                console.log("generate process succeeded");
            } else {
                //TODO: signal to AWS queue that request ID {data.requestId} failed due to exit code ${code}
                console.log(`generate process exited with code ${code}`);
            }
            child = null;
            // TODO: send SERVER_IDLE signal to AWS Queue
        });
    } else {
        //TODO: signal to AWS queue that request ID {data.requestId} failed SERVER_BUSY
        console.log("generate request failed, server busy");
    }
}

function cancel(data) {
    if (child) {
        if (child.customData.requestId == data.requestId) {
            child.kill();
            console.log("generate process cancelled");
            //TODO: signal to AWS queue that request ID was terminated
        } else {
            console.log("did not cancel generate process, requestIDs did not match");
            //TODO: signal to AWS queue that cancel failed because we wanted to cancel a request this server is not servicing
        }
    } else {
        console.log("cancel request ignored since generate process already went away");
        //TODO: signal that termination failed since the generate process already went away
    }
}

process.on('uncaughtException', function(err) {
    console.log(err.message + "\n" + err.stack);
});
