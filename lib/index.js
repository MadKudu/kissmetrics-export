var S3 = require('./s3');
var Stream = require('./stream');
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
	this._readStream = new Stream(this.s3, parameters);
	return this._readStream.pipe(split(stream.parser));
};

module.exports = KmExport;
