/* globals describe, it, before*/
(function () {
	'use strict';
	var _ = require('lodash');
	var chai = require('chai');
	// var chaiAsPromised = require('chai-as-promised');
	// chai.use(chaiAsPromised);
	var should = require('chai').should();
	var expect = chai.expect;

	var config = {
		Bucket: 'madkudu-test-kissmetrics-20150225',
		accessKeyId: 'AKIAIGXARIHO3TZTGRGA',
		secretAccessKey: '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',
	};

	describe('Stream', function () {
		var parameters = {
			fromDate: new Date('2015-04-01'),
			toDate: new Date('2015-04-03')
		};
		var Stream = require('../lib/stream');
		var stream = new Stream(config, parameters);
		describe('bla', function() {
			it('should stream data', function (done) {
				this.timeout('60000');
				stream.on('data', function(data) {
					console.log(data.toString('utf-8'));
					//.toString('utf-8')
				});
				stream.on('end', function() {
					console.log('done');
					done();
				});
			});
		});
	});
}());


