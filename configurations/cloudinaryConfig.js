const cloudinary = require('cloudinary').v2; 
require('dotenv').config();  

// Cloudinary configuration:
cloudinary.config({
    cloud_name: process.env.TEMP_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.TEMP_CLOUDINARY_API_KEY,
    api_secret: process.env.TEMP_CLOUDINARY_API_SECRET,
});

module.exports = cloudinary; 