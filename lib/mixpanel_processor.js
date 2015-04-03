var aws = require('aws-sdk');

function MkProcessor(config, options) {
	options = options || {};

	this.S3 = new aws.S3(config);
}

module.exports = MkProcessor;
