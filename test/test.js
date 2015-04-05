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

	describe('KmProcessor', function () {
		var KmProcessor = require('../lib/kissmetrics_processor');
		var kmProcessor;
		before(function() {
			kmProcessor = new KmProcessor(config);
		});
		describe('s3', function() {
			it('should have a s3 object', function () {
				expect(kmProcessor).to.have.a.property('s3');
			});
		});
	});
}());
