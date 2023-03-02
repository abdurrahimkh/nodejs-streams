const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const fName = file.originalname;
    cb(null, fName);
  },
});

const upload = multer({ storage: storage }).single('file');

module.exports = { upload };
