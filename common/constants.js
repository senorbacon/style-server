var constants = {};

// commands
constants.MSG_JOB_START = "JOB_START";
constants.MSG_JOB_RETRY = "JOB_RETRY";

// server status updates
constants.MSG_SERVER_ONLINE = "SERVER_ONLINE";
constants.MSG_JOB_STARTED = "JOB_STARTED";
constants.MSG_JOB_FINISHED = "JOB_FINISHED";
constants.MSG_SERVER_BUSY = "SERVER_BUSY";

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

module.exports = constants;