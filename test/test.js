/* globals describe, it, before*/
(function () {
	'use strict';
	var chai = require('chai');
	// var chaiAsPromised = require('chai-as-promised');
	// chai.use(chaiAsPromised);
	var should = require('chai').should();
	var expect = chai.expect;

	var s3_config = {
		accessKeyId: 'AKIAIKSNXIKWMHYE7ZSA',
		secretAccessKey: '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',
	};

	var options = {};

	describe('kue_concierge', function () {
		var KmProcessor = require('../index.js');
		describe('exports', function () {
			var kmProcessor;
			before(function() {
				kmProcessor = new KmProcessor(s3_config, options);
			});
			it('should initialize a client', function () {
				expect(kmProcessor).to.have.a.property('S3');
			});
		});
	});
}());
