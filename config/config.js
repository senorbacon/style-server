var config = {};

// export EC2_INSTANCE_ID="`wget -q -O - http://instance-data/latest/meta-data/instance-id`"
config.server_id = process.env.EC2_INSTANCE_ID || "unnamed";

config.env = process.env.ENVIRONMENT || "dev";
config.debug = process.env.DEBUG || 0;

config.server_port = process.env.STYLE_SERVER_PORT || 3000;

config.bucket_public = 'ww-style-public';
config.bucket_users = 'ww-style-users';
config.tmp_dir = process.env.TEMP_DIR || "c:\\tmp\\style\\";

config.restart_threshold = 20;

config.command = process.env.STYLE_CMD || "node";
config.args = process.env.STYLE_CMD_ARGS || "./src/delay.js";

module.exports = config;