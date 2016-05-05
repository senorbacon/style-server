var childProcess = require("child_process");
var child = null;

var command = "node";
var args = ["./src/delay.js"];

process.on('message', function(data)
{
    if (data.generate) {
        if (!child) {
            child = childProcess.spawn(command, args);
            child.customData = data;

            child.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
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
            });
        } else {
            //TODO: signal to AWS queue that request ID {data.requestId} failed SERVER_BUSY
            console.log("generate request failed, server busy");
        }
    } else if (data.cancel) {
        if (child) {
            if (child.customData.generate.requestId = data.cancel.requestId) {
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
}).on('uncaughtException', function(err)
{
    console.log(err.message + "\n" + err.stack);
});
