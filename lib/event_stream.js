var Transform = require('readable-stream').Transform;
var debug = require('debug')('kissmetrics-export');
var _ = require('lodash');

var EventStream = function(s3, options) {
	this.options = options || {objectMode: true};
	Transform.call(this, this.options);
	this.s3 = s3;
};

var util = require('util');
util.inherits(EventStream, Transform);

EventStream.prototype._transform = function(file, encoding, callback) {
	this.readFile(file).then(function() {
		debug('pushed content of file ' + file);
		callback();
	}).catch(function(err) {
		debug('error reading file ' + file + ': ' + err);
		callback(err);
	});
};

/** todo: iterate on objects (if more than 1,000) */
EventStream.prototype.readFile = function(file) {
	var stream = this;
	return this.s3.getS3Object(file).then(function(data) {
		stream.push(data.Body.toString('utf-8'));
	});
};

module.exports = EventStream;



