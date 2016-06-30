/**
 * Defines a domain event
 */
module.exports.Event = function(fromServer, type, data) {
    this.fromServer = fromServer;
    this.type = type;
    this.data = data;
}

