var Readable = require('readable-stream').Readable;
var async = require('async');
var Q = require('q');

var ReadStream = function(s3, parameters) {
	var options = {encoding: 'utf8'};
	Readable.call(this, options);
	this.parameters = parameters || {};
	this.s3 = s3;
	this.counter = 0;
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
	return this.s3.listS3Objects(this.parameters)
		.then(function(files) {
			this.connecting = false;
			return stream.pushFiles(files).then(function() {
				stream.push(null);
			});
		}).catch(function(err) {
			throw err;
		});
};

ReadStream.prototype.pushFiles = function(files) {
	var deferred = Q.defer();
	var stream = this;
	async.each(files,
		function(file, callback) {
			stream.pushFile(file, callback);
	}, function(err) {
		if(err) {
			deferred.reject(err);
		} else {
			console.log(stream.counter + ' files pushed');
			deferred.resolve();
		}
	});
	return deferred.promise;
};

ReadStream.prototype.pushFile = function(file, callback) {
	var stream = this;
	this.s3.getS3Object(file).then(function(data) {
		stream.push(data.Body.toString('utf-8'));
		stream.counter += 1;
		callback();
	});
};

module.exports = ReadStream;



