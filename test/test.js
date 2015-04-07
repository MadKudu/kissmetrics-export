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
		Bucket: process.env.s3_bucket,
		accessKeyId: process.env.s3_access_key,
		secretAccessKey: process.env.s3_secret_access_key,
	};

	describe('KmStream', function () {
		var parameters = {
			fromDate: new Date('2015-04-01'),
			toDate: new Date('2015-04-03')
		};
		var KmProcessor = require('../lib/index');
		var kmProcessor = new KmProcessor(config);
		var stream = kmProcessor.stream(parameters);
		describe('bla', function() {
			it('should stream data', function (done) {
				this.timeout('60000');
				stream.on('data', function(data) {
					expect(data).to.be.not.null;
				});
				stream.on('end', function() {
					console.log('done');
					done();
				});
			});
		});
	});
}());


