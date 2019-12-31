const { expect } = require('chai');
const S3 = require('../lib/s3');
const ObjectStream = require('../lib/object_stream');

const config = {
  Bucket: process.env.s3_bucket,
  accessKeyId: process.env.s3_access_key,
  secretAccessKey: process.env.s3_secret_access_key,
};

describe('ObjectStream', function () {
  const s3 = new S3(config);
  const stream = new ObjectStream(s3);
  it('streams names of S3 objects', function(done) {
    this.timeout(60000);
    // let counter = 0;
    stream.on('data', function(data) {
      counter += 1;
      expect(data).to.be.an('object');
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


