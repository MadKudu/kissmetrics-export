var Readable = require('stream').Readable;
var KmS3 = require('./s3');
var async = require('async');
var Q = require('q');

var ReadStream = function(config, parameters) {
	var options = {};
	Readable.call(this, options);
	this.config = config;
	this.parameters = parameters || {};
	this.s3 = new KmS3(this.config);
};

var util = require('util');
util.inherits(ReadStream, Readable);

ReadStream.prototype._read = function() {
	// necessary to stop _read from proceedding and avoid duplicate requests
	if (this.connecting || this.ended) {
		return;
	}
	this.readFiles();
};

/** todo: iterate on objects (if more than 1,000) */
ReadStream.prototype.readFiles = function() {
	var stream = this;
	this.connecting = true;
	return this.s3.listS3Objects(this.parameters).then(function(files) {
		this.connecting = false;
		return stream.pushFiles(files).then(function() {
			stream.push(null);
		});
	});
};

ReadStream.prototype.pushFiles = function(files) {
	var deferred = Q.defer();
	var stream = this;
	async.eachSeries(files,
		function(file, callback) {
			stream.pushFile(file, callback);
	}, function(err) {
		if(err) {
			deferred.reject(err);
		} else {
			console.log('All files pushed');
			deferred.resolve();
		}
	});
	return deferred.promise;
};

ReadStream.prototype.pushFile = function(file, callback) {
	var stream = this;
	this.s3.getS3Object(file).then(function(data) {
		stream.push(data.Body.toString('utf-8'));
		callback();
	});
};

var parseStream = new require('newline-json').Parser();

// var testStream = function(config, bucket, key) {
// 	var kmS3 = new KmS3(config);
// 	var params = {
// 		Bucket: bucket,
// 		Key: key
// 	};
// 	return kmS3.s3.getObject(params).createReadStream().pipe(parseStream);
// };

module.exports = ReadStream;



