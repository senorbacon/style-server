var config = {};

// export EC2_INSTANCE_ID="`wget -q -O - http://instance-data/latest/meta-data/instance-id`"
config.serverId = process.env.EC2_INSTANCE_ID || "unnamed";

config.env = process.env.ENVIRONMENT || "dev";
config.debug = process.env.DEBUG || 0;

config.serverPort = process.env.STYLE_SERVER_PORT || 3000;

config.bucketPublic = 'ww-style-public';
config.bucketUsers = 'ww-style-users';
config.tmpDir = process.env.STYLE_TEMP_DIR || "c:\\tmp\\style\\";

config.restartThreshold = 20;

config.command = process.env.STYLE_CMD || "node";
config.args = process.env.STYLE_CMD_ARGS || "./delay.js";

config.mongodb = {
    user: process.env.STYLE_MONGODB_USER || "style",
    password: process.env.STYLE_MONGODB_PASSWORD || "hulksmash",
    server: process.env.STYLE_MONGODB_SERVER || "localhost",
    database: process.env.STYLE_MONGODB_DATABASE || "style",
}

module.exports = config;