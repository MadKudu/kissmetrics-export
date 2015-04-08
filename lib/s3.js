var aws = require('aws-sdk');
var Q = require('q');
var _ = require('lodash');
var moment = require('moment');

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
KmS3.prototype.listS3Objects = function(dateRange) {
	var kmp = this;
	var params = {
		Bucket: this.bucket,
		Prefix: 'revisions/'
	};
	return Q.ninvoke(kmp.s3, 'listObjects', params).then(function(data) {
		return kmp.filterS3ObjectsByDate(data.Contents, dateRange);
	});
};

KmS3.prototype.filterS3ObjectsByDate = function(contents, dateRange) {
	if (typeof dateRange === 'undefined') {
		return contents;
	}
	if (!_.isDate(dateRange.fromDate) || !_.isDate(dateRange.toDate)) {
		throw Error('Not a valid date range');
	}
	var fromDate = moment(dateRange.fromDate).valueOf();
	var toDate = moment(dateRange.toDate).valueOf();
	return _.chain(contents).map(function(object) {
		var lastModified = moment(object.LastModified).valueOf();
		if (lastModified >= fromDate && lastModified <= toDate) {
			return object.Key;
		} else {
			return;
		}
	}).compact().value();
};

KmS3.prototype.getS3Object = function(key) {
	var params = {
		Bucket: this.bucket,
		Key: key
	};
	var s3 = this.s3;
	return Q.ninvoke(s3, 'getObject', params);
};

KmS3.prototype.createStreamfromObject = function(key) {
	var params = {
		Bucket: this.bucket,
		Key: key
	};
	return this.s3.getObject(params).createReadStream();
};

module.exports = KmS3;
