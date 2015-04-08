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

	describe('KmProcessor', function () {
		var KmExport = require('../lib/index');
		var kmExport = new KmExport(config);
		describe('parser', function() {
			var parser = kmExport.parser;
			it('should parse JSON', function () {
				var json = '{"abc":"cde"}';
				expect(parser(json)).to.deep.equal({abc: 'cde'});
			});
			it('should ignore empty lines', function () {
				var json = '';
				expect(parser(json)).to.be.an('undefined');
			});
			it('should reject unparsable lines', function () {
				var json = 'abc';
				expect(parser(json)).to.be.an('undefined');
			});
		});
		describe('parsed_stream', function() {
				var parameters = {
				fromDate: new Date('2015-04-01'),
				toDate: new Date('2015-04-08')
			};
			var stream = kmExport.stream(parameters);
			it('should stream data', function (done) {
				this.timeout('60000');
				stream.on('data', function(data) {
					console.log(data);
					expect(data).to.be.not.null;
				});
				stream.on('error', function(err) {
					console.log(err.stack);
					expect(0).to.equal(1);
				});
				stream.on('end', function() {
					console.log('done');
					done();
				});
			});
		});
	});
}());


