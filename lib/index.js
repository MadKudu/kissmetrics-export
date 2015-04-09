var S3 = require('./s3');
var ObjectStream = require('./object_stream');
var FilterStream = require('./filter_stream');
var EventStream = require('./event_stream');
var split = require('split');

function KmExport(config) {
	this.s3 = new S3(config);
}


KmExport.prototype.parser = function(line) {
	try {
		if (line.length > 0) {
			return JSON.parse(line);
		}
	} catch(e) {
		console.log('Ignored line: ' + line);
	}
};

KmExport.prototype.stream = function(parameters) {
	var stream = this;
	this._objectStream = new ObjectStream(this.s3);
	this._filterStream = new FilterStream(parameters);
	this._eventStream = new EventStream(this.s3);
	return this._objectStream.pipe(this._filterStream).pipe(this._eventStream).pipe(split(stream.parser));
};

module.exports = KmExport;
