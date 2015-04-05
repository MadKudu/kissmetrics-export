var S3 = require('./s3');
var Stream = require('./stream');

function KmStreamExport(config, parameters) {
	this.s3 = new S3(config);
	var readStream = new Stream(config, parameters);
	var parseStream = new require('newline-json').Parser();
	this.stream = readStream.pipe(parseStream);
}

module.exports = KmStreamExport;
