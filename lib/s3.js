var aws = require('aws-sdk');
var Q = require('q');

function KmS3(config) {
	this.init(config);
}

KmS3.prototype.init = function(config) {
	if (!config) {
		throw Error('A S3 configuration object is required');
	}
	if (!config.Bucket) {
		throw Error('A Bucket parameter is required');
	}
	this.s3 = new aws.S3(config);
	this.bucket = config.Bucket;
};

/** todo: support fetching more than 1000 objects */
KmS3.prototype.listS3Objects = function(marker) {
	var self = this;
	var params = {
		Bucket: this.bucket,
		Prefix: 'revisions/',
		Marker: marker
	};
	return Q.ninvoke(self.s3, 'listObjects', params).then(function(data) {
		return data;
	});
};

KmS3.prototype.getS3Object = function(key) {
	var params = {
		Bucket: this.bucket,
		Key: key
	};
	var s3 = this.s3;
	return Q.ninvoke(s3, 'getObject', params);
};

module.exports = KmS3;
