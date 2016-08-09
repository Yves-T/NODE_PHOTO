const gm = require('gm');
const Promise = require('bluebird');

module.exports = {
  resizeFile: function (fileName, size) {
    return new Promise((resolve, reject) => {
      gm(fileName).resize(size).write(fileName, (err) => {
        if (err) reject(err);

        resolve();
      });

    });
  }
};
