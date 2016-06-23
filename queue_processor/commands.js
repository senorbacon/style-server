var config = require('../config');
var sqs = require('../sqs/sqs.js');

module.exports.jobRetry = function(event) {
    // look up job with id event.jobId
    // increment jobs.attempts
    // if jobs.attempts > config.job_retry_threshold then send JOB_FAILED
    // otherwise call jobStart(event)
}