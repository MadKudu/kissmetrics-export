var aws = require('aws-sdk');
var Q = require('q');
var _ = require('lodash');
var moment = require('moment');

function KmProcessor(config, params) {
	this.params = params || {};
	if (!config) {
		throw Error('A S3 configuration object is required');
	}
	if (!params.Bucket) {
		throw Error('A Bucket parameter is required');
	}
	this.s3 = new aws.S3(config);
}

/** todo: support fetching more than 1000 objects */
KmProcessor.prototype.listS3Objects = function(dateRange) {
	var kmp = this;
	var deferred = Q.defer();
	var params = this.params;
	params.Prefix = 'revisions/';
	this.s3.listObjects(params, function(err, data) {
		if (err) {
			return deferred.reject(err); // an error occurred
		}
		else {
			var objects = kmp.filterS3ObjectsByDate(data.Contents, dateRange);
			return deferred.resolve(objects); // successful response
		}
	});
	return deferred.promise;
};

KmProcessor.prototype.filterS3ObjectsByDate = function(contents, dateRange) {
	if (typeof dateRange === 'undefined') {
		return contents;
	}
	if (!_.isDate(dateRange.fromDate) || !_.isDate(dateRange.toDate)) {
		throw Error('Not a valid date range');
	}
	var fromDate = moment(dateRange.fromDate).valueOf();
	var toDate = moment(dateRange.toDate).valueOf();
	return _.filter(contents, function(object) {
		var lastModified = moment(object.LastModified).valueOf();
		return lastModified >= fromDate && lastModified <= toDate;
	});
};

module.exports = KmProcessor;
