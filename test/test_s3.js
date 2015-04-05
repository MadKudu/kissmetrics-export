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

	var options = {};

	var contents = [{
			Key: 'revisions/1.json',
			LastModified: new Date('2015-04-01'),
			ETag: '1e1e90e47dddd56ab3b3771231a2aa49',
			Size: 1199,
			StorageClass: 'STANDARD',
			Owner: {}
		},
		{
			Key: 'revisions/10.json',
			LastModified: new Date('2015-04-05'),
			ETag: '"2949394731faf129789c6b61ff447b10"',
			Size: 303,
			StorageClass: 'STANDARD',
			Owner: {}
	}];

	describe('KmS3', function () {
		var KmS3 = require('../lib/s3.js');
		var kmS3;
		before(function() {
			kmS3 = new KmS3(config);
		});
		describe('filterS3ObjectsByDate', function() {
			it('should return the entire content if no range is provided', function () {
				expect(kmS3.filterS3ObjectsByDate(contents)).to.have.length(2);
			});
			it('should throw an error if not a valid date range', function () {
				var dateRange = {
					fromDate: 'abc',
					toDate: new Date('2015-04-03')
				};
				try {
					kmS3.filterS3ObjectsByDate(contents, dateRange);
				} catch (e) {
					expect(_.isError(e)).to.be.true;
				}
			});
			it('should return two objects', function () {
				var dateRange = {
					fromDate: new Date('2015-03-31'),
					toDate: new Date('2015-04-30')
				};
				expect(kmS3.filterS3ObjectsByDate(contents, dateRange)).to.have.length(2);
			});
			it('should return no object', function () {
				var dateRange = {
					fromDate: new Date('2015-03-01'),
					toDate: new Date('2015-03-31')
				};
				expect(kmS3.filterS3ObjectsByDate(contents, dateRange)).to.have.length(0);
			});
			it('should return one object', function () {
				var dateRange = {
					fromDate: new Date('2015-04-01'),
					toDate: new Date('2015-04-03')
				};
				expect(kmS3.filterS3ObjectsByDate(contents, dateRange)).to.have.length(1);
			});
		});
		describe('listS3Objects', function () {
			it('should list objects in the bucket', function () {
				return kmS3.listS3Objects().then(function(data) {
					expect(typeof data).to.not.equal('undefined');
				});
			});
			it('should list objects with a date range', function () {
				var dateRange = {
					fromDate: new Date('2015-03-08'),
					toDate: new Date('2015-03-09')
				};
				return kmS3.listS3Objects(dateRange).then(function(data) {
					expect(typeof data).to.not.equal('undefined');
				});
			});
		});
		describe('getS3Object', function () {
			it('should get an object', function () {
				return kmS3.getS3Object('revisions/118.json').then(function(data) {
					// console.log(data.Body.toString('utf-8'));
					expect(typeof data).to.not.equal('undefined');
				});
			});
		});
	});
}());
