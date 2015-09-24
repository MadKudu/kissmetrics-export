var through2 = require('through2-concurrent');

exports = module.exports = function (s3) {

	var data_stream = through2.obj({ maxConcurrency: 16 }, function (key, encoding, callback) {
		if (!key) {
			return callback();
		}

		s3.getS3Object(key).then(function(data) {
			// debug(data);
			data_stream.push(data.Body.toString('utf-8'));
			callback();
		}).catch(function (err) {
			callback(err);
		});
	});
	return data_stream;
};


