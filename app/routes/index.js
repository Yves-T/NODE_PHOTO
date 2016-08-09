"use strict";
const Promise = require('bluebird');
const SingleImage = require('../models/singleImage').SingleImage;
const fileHelper = require('../helpers/fileHelper');
const imageHelper = require('../helpers/imageHelper');
const socketHelper = require('../helpers/socketHelper');
const knoxClient = require('../knox').knoxClient;
const formidable = require('formidable');
const express = require('express');
const router = express.Router();
const fs = require('fs');
Promise.promisifyAll(fs);
const os = require('os');
const passport = require('passport');

module.exports = (io) => {

  let Socket;

  io.on('connect', socket => {
    Socket = socket;
  });

  router.get('/', (req, res, next) => {
    res.render('index', {});
  });

  router.get('/photoGallery', isLoggedIn, (req, res, next) => {
    const profilePic = req.user.google.profilePic;
    res.render('photoGallery', {host: req.app.get('host'), profilePic});
  });

  router.post('/upload', (req, res, next) => {
    // file upload
    var tmpFile, newFileName, randomFileName;
    const newForm = new formidable.IncomingForm();
    newForm.keepExtensions = true;
    const parseForm = Promise.promisify(newForm.parse, {
      multiArgs: true,
      context: newForm
    });
    parseForm(req).spread((fields, files) => {
      tmpFile = files.upload.path;
      randomFileName = fileHelper.generateRandomFileName(files.upload.name);
      newFileName = os.tmpdir() + '/' + randomFileName;
      res.writeHead(200, {'Content-type': 'text/plain'});
      res.end();
    }).catch(err => console.log(err));

    newForm.on('end', () => {
      // when the file upload is complete, rename the file
      fs.renameAsync(tmpFile, newFileName)                // rename tmp file
        .then(imageHelper.resizeFile(newFileName, 300))          // resize image
        .then(() => fs.readFileAsync(newFileName))      // read resized image
        .then((buf) => {                                // upload to S3 bucket
          var knoxRequest = knoxClient.put(randomFileName, {
            'Content-length': buf.length,
            'Content-Type': 'image/jpeg'
          });

          knoxRequest.on('response', (res) => {
            if (res.statusCode == 200) {
              // file is in S3 bucket
              // parallel persist image and socket emit to client
              const imageCreatePromise = persistSingleImagePromise(randomFileName, req.user);
              const ePr = socketHelper.uploadFinishedPromise(Socket);

              Promise.join(imageCreatePromise, ePr).then((test) => { // parallel operation is finished
                fs.unlink(newFileName, () => {
                  console.log('Local file deleted');
                });
              });
            }
          });

          knoxRequest.end(buf);
        })
        .catch(error => console.log(error));
    });
  });

  router.get('/getImages', (req, res, next) => {
    SingleImage.find({createdBy: req.user._id}, null, {sort: {votes: -1}})
      .populate('createdBy')
      .exec((err, result) => {
        if (err) console.log(err);
        res.send(JSON.stringify(result));
      })
      .catch(err => res.status(500).send());
  });


  router.get('/voteup/:id', (req, res, next) => {
    const id = req.params.id;

    SingleImage.findByIdAndUpdateAsync(id, {$inc: {votes: 1}}, {new: true})
      .then((result) => res.send(200, {votes: result.votes}))
      .catch(err => res.send(500));
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  function persistSingleImagePromise(randomFileName, user) {
    return SingleImage.createAsync({
      filename: randomFileName,
      votes: 0,
      createdBy: user._id
    });
  }

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
  }

  return router;
};

