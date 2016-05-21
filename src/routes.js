var httpStatus = require('http-status-codes');
var launcher = require('./src/launcher.js');

module.exports.generate = function(req, res) {
    status = httpStatus.OK;

    data = {
        command: "generate",
        data: req.body || req.query
    }

    if (!launcher.validate(data)) {
        status = httpStatus.BAD_REQUEST;
    }

    if (!launcher.send(data)) {
        status = httpStatus.SERVICE_UNAVAILABLE;
    }

    res.status(status).send();
}

module.exports.cancel = function(req, res) {
    status = httpStatus.OK;

    data = {
        command: "cancel",
        data: req.body || req.query
    }

    if (!launcher.validate(data)) {
        status = httpStatus.BAD_REQUEST;
    }

    // if launcher went away, there's nothing to cancel so this always returns OK 
    // but log it if so
    if (!launcher.send(data)) {
        console.log("cancel request ignored since launcher process is unavailable");
        //TODO: signal that cancel failed since the launcher process went away
    }

    res.status(status).send();
}

function validate(msg) {
    var result = true;
    var command = msg.command || '';
    var data = msg.data;

    if (!data.requestId) {
        console.log("Missing parameter requestId");
        return false;
    }

    switch (command) {
        case 'generate': {
            if (!data.styleImage) {
                console.log("Missing parameter styleImage");
                return false;
            }
            if (!data.contentImage) {
                console.log("Missing parameter contentImage");
                return false;
            }
            
        }
    }
    return true;
}

