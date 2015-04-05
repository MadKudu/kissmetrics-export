var S3 = require('./s3');

function KmProcessor(config, params) {
	this.s3 = new S3(config);
}

module.exports = KmProcessor;
