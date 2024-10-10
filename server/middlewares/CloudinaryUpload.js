const Cloudinary = require('cloudinary').v2;
const ApiResponse = require('../utils/ApiResponse');

// Check if environment variables are loaded
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
    console.error("Cloudinary configuration is not set properly in the environment variables.");
    // throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
}

// Configure Cloudinary
Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || "do34gd7bu",
    api_key: process.env.CLOUDINARY_API_KEY || "658284914137226",
    api_secret: process.env.CLOUDINARY_SECRET_KEY || "MfABahlFqPWadh1EqS33JlgHicQ"
});

// Upload image function
const uploadImage = async (file, res) => {
    try {
        if (!file || !file.buffer) {
            return ApiResponse.error(res, "No file provided or file buffer is empty", 400);
        }

        const result = await new Promise((resolve, reject) => {
            const stream = Cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    reject(new Error("Error uploading image: " + error.message));
                } else if (result) {
                    resolve(result);
                } else {
                    reject(new Error("Unknown error occurred during image upload"));
                }
            });
            stream.end(file.buffer);
        });

        return {
            ImageUrl: result.secure_url,
            PublicId: result.public_id
        };
    } catch (error) {
        console.error("Error in uploadImage function:", error);
        return ApiResponse.error(res, "Failed to upload image", 500, error);
    }
};

// Upload single image function
const uploadSingleImage = async (req, res, next) => {
    try {
        const file = req.file;
        console.log(file)
        if (!file) {
            return ApiResponse.error(res, "No file provided", 400);
        }

        const result = await uploadImage(file, res);
        if (!result) {
            return ApiResponse.error(res, "Failed to upload image", 500);
        }

        req.uploadedImage = result; // Save the uploaded image details for use in the next middleware/controller
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Error in uploadSingleImage function:", error);
        return ApiResponse.error(res, "Failed to upload image", 500, error);
    }
};

module.exports = {
    uploadImage,
    uploadSingleImage
};
