const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUD_API_KEY);
console.log(process.env.CLOUD_API_SECRET);
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});//cloudinary instance create karna
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, //cloudinary instance
    params: {
        folder: "wanderlust_DEV", //kis folder me images store karni hai
        allowed_formats: ["jpeg", "png", "jpg"], //allowed formats
    },
});

module.exports = {
    cloudinary,
    storage,
};