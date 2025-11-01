const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) =>{
  const ok = /image\/(png|jpe?g|webp)|application\/pdf/.test(file.mimetype);
  if(ok) cb(null, true);
  else cb(new Error('Only image and pdf files are allowed'), false);
};

const upload = multer({
    storage, 
    limits: {fileSize: 5*1024*1024},
    fileFilter
});

module.exports = upload;