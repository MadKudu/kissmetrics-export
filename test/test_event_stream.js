/* globals describe, it, before*/
(function () {
	'use strict';
	var chai = require('chai');
	// var chaiAsPromised = require('chai-as-promised');
	// chai.use(chaiAsPromised);
	var should = require('chai').should();
	var expect = chai.expect;
	var from = require('from2');

	var config = {
		Bucket: process.env.s3_bucket,
		accessKeyId: process.env.s3_access_key,
		secretAccessKey: process.env.s3_secret_access_key,
	};

	describe('EventStream', function () {
		var S3 = require('../lib/s3');
		var s3 = new S3(config);
		var EventStream = require('../lib/event_stream');
		var eventStream = new EventStream(s3);
		it('should read the files coming from an object stream', function(done) {
			this.timeout(60000);
			// mock an objectStream
			var files = ['revisions/2.json','revisions/3.json'];
			var objectStream = from.obj(function(size, next) {
				if (files.length <= 0) {
					return this.push(null);
				}
				var chunk = files.slice(0,1)[0];
    			files = files.slice(1);
				next(null, chunk);
			});
			var stream = objectStream.pipe(eventStream);
			eventStream.on('data', function(data) {
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
}());


