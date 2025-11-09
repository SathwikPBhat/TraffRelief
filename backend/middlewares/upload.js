const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ok = /image\/(png|jpe?g|webp)|application\/pdf|audio\/mpeg|audio\/mp3/.test(file.mimetype);
  if (ok) cb(null, true);
  else cb(new Error('Only image, pdf, and mp3 files are allowed'), false);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

module.exports = upload;
