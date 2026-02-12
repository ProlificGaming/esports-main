const multer = require('multer'); 
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const cloudinary = require('../configurations/cloudinaryConfig.js');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder:  "tournaments/banners",
        allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
        transformation: [
            { width: 3000, crop: "limit" },             // prevent massive images
            // { aspect_ratio: "6:1", crop: "fill" },      // enforce banner shape
            { quality: "auto" },
        ],
    }),
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter(req, file, cb){
        if (!file.mimetype.startsWith("image/"))
        {
            return cb(new Error("Only image files allowed"), false); 
        }
        cb(null, true);
    },
});

module.exports = upload; 