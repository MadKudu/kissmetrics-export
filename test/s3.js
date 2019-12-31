const { expect } = require('chai');
const KmS3 = require('../lib/s3.js');

const config = {
  Bucket: process.env.s3_bucket,
  accessKeyId: process.env.s3_access_key,
  secretAccessKey: process.env.s3_secret_access_key,
};

describe('KmS3', function () {
  const kmS3;
  before(function() {
    kmS3 = new KmS3(config);
  });
  describe('listS3Objects', function () {
    it('should list all objects in the bucket', function (done) {
      this.timeout(10000);
      kmS3.listS3Objects().then(function(data) {
        expect(typeof data).to.not.equal('undefined');
        done();
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
