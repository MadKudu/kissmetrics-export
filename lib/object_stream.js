const { Readable } = require('stream');
const _ = require('lodash');
const debug = require('debug')('kissmetrics-export');
const util = require('util');

const ObjectStream = function(s3, options) {
	this.options = options || { objectMode: true };
	Readable.call(this, this.options);
	this.connecting = false;
 	this.ended  = false;
	this.s3 = s3;
	this.counter = 0;
};

util.inherits(ObjectStream, Readable);

ObjectStream.prototype._read = function() {
	// necessary to stop _read from proceeding and avoid duplicate requests
	if (this.connecting || this.ended) {
		return;
	}
	this._listObjects();
};

/** todo: iterate on objects (if more than 1,000) */
ObjectStream.prototype._listObjects = function() {
	const stream = this;
	this.connecting = true;
	debug('start reading one batch for marker : ' + stream.marker);
	return this.s3.listS3Objects(stream.marker)
		.then(function(data) {
			stream.connecting = false;
			const files = data.Contents;
			if (data.IsTruncated) {
				stream.marker = files[files.length - 1].Key;
			} else {
				stream.ended = true;
			}
			_.forEach(files, function(file) {
				stream.push(file);
			});
			if (stream.ended) {
				stream.push(null);
			}
		}).then(function() {
			debug('done reading one batch for marker : ' + stream.marker);
		}).catch(function(err) {
			console.log(err);
			stream.emit('error', err);
		});
};

module.exports = ObjectStream;
