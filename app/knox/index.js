const knox = require('knox');
const config = require('../config/config');

const knoxClient = knox.createClient({
  key: config.S3AccessKey,
  secret: config.S3Secret,
  bucket: config.S3Bucket
});

module.exports = {
  knoxClient
};
