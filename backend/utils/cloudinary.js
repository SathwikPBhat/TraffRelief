const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const multer = require("multer")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isVictim = req.originalUrl.includes("/add-victim") || req.originalUrl.includes("/add-initial-details");
    return {
      folder: isVictim ? "victim_photos" : "staff_photos",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

const uploadCloud = multer({
    storage: storage,
    limits: {fileSize: 5*1024*1024}
})

module.exports = {cloudinary, uploadCloud}