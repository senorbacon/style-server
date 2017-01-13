var constants = {};

////////////
// commands
////////////

constants.MSG_JOB_START = "JOB_START";
constants.MSG_JOB_RETRY = "JOB_RETRY";
constants.MSG_JOB_CANCEL = "JOB_CANCEL";

////////////
// updates
////////////

// server status updates
constants.MSG_SERVER_ONLINE = "SERVER_ONLINE";
constants.MSG_SERVER_OFFLINE = "SERVER_OFFLINE";
constants.MSG_SERVER_READY = "SERVER_READY";
constants.MSG_SERVER_BUSY = "SERVER_BUSY";
constants.MSG_SERVER_KILLED = "SERVER_KILLED";

// job status updates
constants.MSG_JOB_STARTED = "JOB_STARTED";
constants.MSG_JOB_FINISHED = "JOB_FINISHED";

// supporting service updates
constants.MSG_DOWNLOAD_SERVER_ERROR = "DOWNLOAD_SERVER_ERROR";
constants.MSG_GENERATOR_RESTART = "GENERATOR_RESTART";
constants.MSG_GENERATOR_FAILURE_THRESHOLD = "GENERATOR_FAILURE_THRESHOLD";

// generate request updates
constants.MSG_JOB_PROGRESS = "JOB_PROGRESS";
constants.MSG_JOB_SUCCESS = "JOB_SUCCESS";
constants.MSG_JOB_FAILED = "JOB_FAILED";
constants.MSG_JOB_CANCELLED = "JOB_CANCELLED";
constants.MSG_CANCEL_FAILED = "CANCEL_FAILED";
constants.MSG_INVALID_CANCEL_REQ = "INVALID_CANCEL_REQ";
constants.MSG_CANCEL_IGNORED = "CANCEL_IGNORED";

////////////////////
// value constants
////////////////////

constants.SERVER_OFFLINE = "OFFLINE";
constants.SERVER_ONLINE = "ONLINE";
constants.SERVER_READY = "READY";
constants.SERVER_BUSY = "BUSY";
constants.SERVER_KILLED = "KILLED";

constants.JOB_NEW = "NEW";
constants.JOB_STARTED = "STARTED";
constants.JOB_COMPLETED = "COMPLETED";
constants.JOB_CANCELLED = "CANCELLED";
constants.JOB_FAILED = "FAILED";
constants.JOB_PAUSED = "PAUSED";
constants.JOB_IN_PROGRESS = "IN_PROGRESS";
constants.JOB_REQUEST_FAILED = "REQUEST_FAILED";


module.exports = constants;