var S3 = require('./s3');
var Stream = require('./stream');

function KmExport(config) {
	this.s3 = new S3(config);
}

KmExport.prototype.stream = function(parameters) {
	this._readStream = new Stream(this.s3, parameters);
	this._parseStream = new require('newline-json').Parser();
	return this._readStream.pipe(this._parseStream);
};

module.exports = KmExport;
