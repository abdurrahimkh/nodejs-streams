const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { upload } = require('../config/multer');
const { Transform, pipeline } = require('stream');
const User = require('../model/userModel');
const csv = require('csvtojson');
const { createGzip } = require('zlib');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/', upload, (req, res) => {
  const filePath = req.file.path;
  const readStream = fs.createReadStream(filePath);
  const writeStream = fs.createWriteStream('output.zip');
  const valueTypeTransform = new Transform({
    objectMode: true,
    transform(chunk, encode, callback) {
      const user = {
        name: chunk.name.toUpperCase(),
        email: chunk.email.toLowerCase(),
        age: Number(chunk.age) + 10,
        salary: Number(chunk.salary),
        isActive: chunk.isActive === 'true',
      };
      callback(null, user);
    },
  });

  const filterTransformation = new Transform({
    objectMode: true,
    transform(chunk, encode, callback) {
      if (!chunk.isActive) {
        callback(null);
        return;
      }
      callback(null, chunk);
    },
  });

  const saveUser = new Transform({
    objectMode: true,
    transform(chunk, encode, cb) {
      User.create(chunk).then(response => cb(null));
    },
  });

  pipeline(readStream, csv({ delimiter: ';' }, { objectMode: true }), valueTypeTransform, filterTransformation, saveUser, createGzip(), writeStream, err => {
    if (err) {
      console.log('ERROR', err);
    } else {
      res.send('SUCCESSFULLY WRITED TO DATABASE');
    }
  });
});

module.exports = router;
