#  [![npm version](https://badge.fury.io/js/kissmetrics-export.svg)](http://badge.fury.io/js/kissmetrics-export) [![Build Status](https://travis-ci.org/MadKudu/kissmetrics-export.svg)](https://travis-ci.org/MadKudu/kissmetrics-export) [![Dependency Status](https://david-dm.org/MadKudu/kissmetrics-export.svg)](https://david-dm.org/MadKudu/kissmetrics-export)


## Install

```sh
$ npm install --save kissmetrics-export
```

## Usage

```js
var kissmetrics-export = require('kissmetrics-export');
var kmExport = new KmExport(config);
```

```js
var stream = kmExport.stream(parameters);
stream.on('data', function(data) {
	console.log(data);
});
stream.on('end', function() {
	console.log('done');
});
```

where parameters is of the form

```js
var parameters = {
	fromDate: new Date('2015-04-01'),
	toDate: new Date('2015-04-03')
};
```

## Inspiration

https://github.com/clay-whitley/export-export
https://github.com/HouseTrip/km-db
https://github.com/mk-anselme/mixpanel-data-export-js

## License

MIT © [Paul Cothenet](http://attackwithnumbers.com)


[npm-url]: https://npmjs.org/package/kissmetrics-export
[npm-image]: https://badge.fury.io/js/kissmetrics-export.svg
[travis-url]: https://travis-ci.org/pcothenet/kissmetrics-export
[travis-image]: https://travis-ci.org/pcothenet/kissmetrics-export.svg?branch=master
[daviddm-url]: https://david-dm.org/pcothenet/kissmetrics-export.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/pcothenet/kissmetrics-export
