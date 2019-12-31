const { expect } = require('chai');
const KmExport = require('../lib/index');

const config = {
  Bucket: process.env.s3_bucket,
  accessKeyId: process.env.s3_access_key,
  secretAccessKey: process.env.s3_secret_access_key,
};

describe('KmProcessor', function () {

  const kmExport = new KmExport(config);
  describe('parser', function() {
    const parser = kmExport.parser;
    it('should parse JSON', function () {
      const json = '{"abc":"cde"}';
      expect(parser(json)).to.be.an('object');
      expect(parser(json)).to.deep.equal({ abc: 'cde' });
    });
    it('should ignore empty lines', function () {
      const json = '';
      const parsed_json = parser(json);
      expect(parsed_json).to.be.an('undefined');
    });
    it('should convert octal escapes into something parsable', function () {
      const json = '{"abc":"cde \\042"}';
      const parsed_json = parser(json);
      expect(parsed_json).to.be.an('object');
      expect(parsed_json).to.deep.equal({ abc: 'cde \\042' });
    });
    it('should reject unparsable lines', function () {
      const json = 'abc';
      const parsed_json = parser(json);
      expect(parsed_json).to.deep.equal({});
    });
    it('should work if the string contains a single quote', function () {
      const json = "{\"abc\":\"cde ' dfg\"}";
      const parsed_json = parser(json);
      // console.log('result', parsed_json);
      expect(parsed_json).to.be.an('object');
      expect(parsed_json).to.deep.equal({ abc: 'cde \' dfg' });
    });
    it('should work in a real life situation', function () {
      const json = '{"alert_name":"Random Alert \\303\\241","tracking_source":"backend","campaign_name":"Sent a new email : new_notification3","_n":"email - email sent","subject":"Municipalidad de Paran\\303\\241: Today\'s Top Customers","customer_id":"187675_17lubpfpjhz44co8kcogsggs8ogs44wskgsks808cowogck8ks","_p":"187675_17lubpfpjhz44co8kcogsggs8ogs44wskgsks808cowogck8ks","alert_id":"353719","email_address":"someone@gmail.com","_t":1443603671}';
      const parsed_json = parser(json);
      // console.log('result', parsed_json);
      expect(parsed_json).to.be.an('object');
    });
  });
  describe('stream', function() {
    const parameters = {
      fromDate: new Date('Tue Apr 05 2015 02:00:00 GMT-0700 (PDT)'),
      toDate: new Date('Tue Apr 07 2015 03:00:00 GMT-0700 (PDT)')
    };
    const stream = kmExport.stream(parameters);
    it('should stream data', function (done) {
      this.timeout('60000');
      const counter = 0;
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


