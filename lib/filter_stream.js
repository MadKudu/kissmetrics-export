const { Transform } = require('stream');
const _ = require('lodash');
const moment = require('moment');
const util = require('util');

const FilterStream = function(parameters) {
	const options = {objectMode: true};
	Transform.call(this, options);
	this.parameters = this._validateParameters(parameters);
};
util.inherits(FilterStream, Transform);

FilterStream.prototype._transform = function(file, encoding, callback) {
	var stream = this;
	if (stream._filterObjectByDate(file, this.parameters)) {
		stream.push(file.Key);
	}
	callback();
};

FilterStream.prototype._validateParameters = function(parameters) {
	if (typeof parameters === 'undefined') {
		throw Error('A date range is required');
	}
	if (!_.isDate(parameters.fromDate) || !_.isDate(parameters.toDate)) {
		throw Error('Not a valid date range');
	} else {
		return parameters;
	}
};

FilterStream.prototype._filterObjectByDate = function(file, parameters) {
	// console.log(parameters);
	if (typeof parameters === 'undefined') {
		return file;
	}
	var fromDate = moment(parameters.fromDate).valueOf();
	var toDate = moment(parameters.toDate).valueOf();
	var lastModified = moment(file.LastModified).valueOf();
	if (lastModified >= fromDate && lastModified <= toDate) {
		return file;
	} else {
		return;
	}
};

module.exports = FilterStream;
