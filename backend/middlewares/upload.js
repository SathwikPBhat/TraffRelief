const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Use diskStorage so uploaded files have a path on disk (req.file.path)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = path.join(__dirname, '..', 'uploads', 'others');
    if (file.fieldname === 'photo') dest = path.join(__dirname, '..', 'uploads', 'photos');
    else if (file.fieldname === 'audio') dest = path.join(__dirname, '..', 'uploads', 'audio');
    else if (file.fieldname === 'file') dest = path.join(__dirname, '..', 'uploads', 'files');

    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (err) {
      return cb(err);
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const mimetype = file.mimetype || '';
  if (/^image\//.test(mimetype) || mimetype === 'application/pdf' || /^audio\//.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image, PDF and audio files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter
});

module.exports = upload;
