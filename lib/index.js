const S3 = require('./s3');
const ObjectStream = require('./object_stream');
const FilterStream = require('./filter_stream');
const getEventStream = require('./event_stream');
const split = require('split');
const jsesc = require('jsesc');

function KmExport(config) {
	this.s3 = new S3(config);
}


KmExport.prototype.parser = function(line) {
	try {
		if (line.length > 0) {
			return JSON.parse(jsesc(line).replace("\\'", "'"));
		}
	} catch(e) {
		return {};
	}
};

KmExport.prototype.stream = function(parameters) {
	const stream = this;
	this._objectStream = new ObjectStream(this.s3);
	this._filterStream = new FilterStream(parameters);
	this._eventStream = getEventStream(this.s3);
	return this._objectStream.pipe(this._filterStream).pipe(this._eventStream).pipe(split(stream.parser));
};

module.exports = KmExport;
