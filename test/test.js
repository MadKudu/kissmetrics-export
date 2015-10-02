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
				expect(parser(json)).to.be.an('object');
				expect(parser(json)).to.deep.equal({ abc: 'cde' });
			});
			it('should ignore empty lines', function () {
				var json = '';
				var parsed_json = parser(json);
				expect(parsed_json).to.be.an('undefined');
			});
			it('should convert octal escapes into something parsable', function () {
				var json = '{"abc":"cde \\042"}';
				var parsed_json = parser(json);
				expect(parsed_json).to.be.an('object');
				expect(parsed_json).to.deep.equal({ abc: 'cde \\042' });
			});
			it('should reject unparsable lines', function () {
				var json = 'abc';
				var parsed_json = parser(json);
				expect(parsed_json).to.deep.equal({});
			});
			it('should work if the string contains a single quote', function () {
				var json = "{\"abc\":\"cde ' dfg\"}";
				var parsed_json = parser(json);
				// console.log('result', parsed_json);
				expect(parsed_json).to.be.an('object');
				expect(parsed_json).to.deep.equal({ abc: 'cde \' dfg' });
			});
			it('should work in a real life situation', function () {
				var json = '{"alert_name":"Random Alert \\303\\241","tracking_source":"backend","campaign_name":"Sent a new email : new_notification3","_n":"email - email sent","subject":"Municipalidad de Paran\\303\\241: Today\'s Top Customers","customer_id":"187675_17lubpfpjhz44co8kcogsggs8ogs44wskgsks808cowogck8ks","_p":"187675_17lubpfpjhz44co8kcogsggs8ogs44wskgsks808cowogck8ks","alert_id":"353719","email_address":"someone@gmail.com","_t":1443603671}';
				var parsed_json = parser(json);
				// console.log('result', parsed_json);
				expect(parsed_json).to.be.an('object');
			});
		});
		describe('stream', function() {
			var parameters = {
				fromDate: new Date('Tue Apr 05 2015 02:00:00 GMT-0700 (PDT)'),
				toDate: new Date('Tue Apr 07 2015 03:00:00 GMT-0700 (PDT)')
			};
			var stream = kmExport.stream(parameters);
			it('should stream data', function (done) {
				this.timeout('60000');
				var counter = 0;
				stream.on('data', function(data) {
					counter += 1;
					expect(data).to.be.an('object');
				});
				stream.on('error', function(err) {
					console.log(err.stack);
					expect(0).to.equal(1);
				});
				stream.on('end', function() {
					expect(counter).to.equal(26);
					console.log('done');
					done();
				});
			});
		});
	});
}());


