var uuid = require('node-uuid');
var path = require('path');
var os = require('os');

console.log(path.extname('52b779ff-faa2-4039-a335-11c7abf85f8e.png'));
var filename = uuid.v4();
console.log(filename);
console.log(os.tmpdir());
