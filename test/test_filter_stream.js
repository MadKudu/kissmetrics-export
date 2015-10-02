/* globals describe, it, before*/
(function () {
	'use strict';
	var chai = require('chai');
	// var chaiAsPromised = require('chai-as-promised');
	// chai.use(chaiAsPromised);
	var expect = chai.expect;

	var config = {
		Bucket: process.env.s3_bucket,
		accessKeyId: process.env.s3_access_key,
		secretAccessKey: process.env.s3_secret_access_key,
	};

	describe('filterObjectByDate', function () {
		var FilterStream = require('../lib/filter_stream');
		var parameters = {
			fromDate: new Date('Tue Apr 07 2015 02:00:00 GMT-0700 (PDT)'),
			toDate: new Date('Tue Apr 07 2015 03:00:00 GMT-0700 (PDT)')
		};
		var stream = new FilterStream(parameters);
		var file = {
			Key: 'revisions/1896.json',
			LastModified: new Date('Tue Apr 07 2015 02:44:48 GMT-0700 (PDT)')
		};
		it('should return the file if no dateRange is provided', function() {
			expect(stream._filterObjectByDate(file)).to.deep.equal(file);
		});
		it('should return the file if in the dateRange', function() {
			var dateRange = {
				fromDate: new Date('2015-03-31'),
				toDate: new Date('2015-04-30')
			};
			expect(stream._filterObjectByDate(file, dateRange)).to.deep.equal(file);
		});
		it('should not return the file if out of the dateRange', function() {
			var dateRange = {
				fromDate: new Date('2015-03-31'),
				toDate: new Date('2015-04-05')
			};
			expect(stream._filterObjectByDate(file, dateRange)).to.be.an('undefined');
		});
	});

	describe('FilterStream', function () {
		var S3 = require('../lib/s3');
		var s3 = new S3(config);
		var ObjectStream = require('../lib/object_stream');
		var FilterStream = require('../lib/filter_stream');
		it('filters S3 objects - date range', function(done) {
			this.timeout(60000);
			var parameters = {
				fromDate: new Date('Tue Apr 05 2015 02:00:00 GMT-0700 (PDT)'),
				toDate: new Date('Tue Apr 07 2015 03:00:00 GMT-0700 (PDT)')
			};
			var filterStream = new FilterStream(parameters);
			var objectStream = new ObjectStream(s3);
			var stream = objectStream.pipe(filterStream);
			var counter = 0;
			stream.on('data', function(data) {
				counter += 1;
				expect(data).to.be.not.null;
			});
			stream.on('error', function(err) {
				console.log(err.stack);
				expect(0).to.equal(1);
			});
			stream.on('end', function() {
				console.log('done');
				expect(counter).to.equal(15);
				done();
			});
		});
		it('filters S3 objects - date range - no results', function(done) {
			this.timeout(60000);
			var parameters = {
				fromDate: new Date('Mon Apr 06 2015 02:00:00 GMT-0700 (PDT)'),
				toDate: new Date('Mon Apr 06 2015 03:00:00 GMT-0700 (PDT)')
			};
			var objectStream = new ObjectStream(s3);
			var filterStream = new FilterStream(parameters);
			var stream = objectStream.pipe(filterStream);
			var counter = 0;
			stream.on('data', function(data) {
				counter += 1;
				expect(data).to.be.not.null;
			});
			stream.on('error', function(err) {
				console.log(err.stack);
				expect(0).to.equal(1);
			});
			stream.on('end', function() {
				console.log('done');
				expect(counter).to.equal(0);
				done();
			});
		});
		it('filter S3 objects - invalid date range', function() {
			var parameters = {
				fromDate: 'abc',
				toDate: 'cde'
			};
			try {
				new FilterStream(parameters);
			}
			catch (e) {
				expect(e.message).to.equal('Not a valid date range');
			}
		});
		it('filter S3 objects - no date range', function() {
			try {
				new FilterStream();
			}
			catch (e) {
				expect(e.message).to.equal('A date range is required');
			}
		});
	});
}());



