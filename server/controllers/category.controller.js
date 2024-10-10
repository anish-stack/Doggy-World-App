const category = require('../models/Category.model')
const { uploadImage } = require('../middlewares/CloudinaryUpload');
const CatchAsync = require('../middlewares/CatchAsync');
const ApiResponse = require('../utils/ApiResponse');
const Cloudinary = require('cloudinary').v2;



exports.CreateCategory = CatchAsync(async (req, res) => {
    try {
        const imageFiles = req.files;
        if (!imageFiles || imageFiles.length === 0) {
            return ApiResponse.error(res, "Please upload at least one image", 400);
        }

        const { CategoryTitle, CategoryType, status } = req.body;
        if (!CategoryTitle) {
            return ApiResponse.error(res, "Please provide a redirect URL", 400);
        }

        // Handle multiple image uploads
        const imageUploadPromises = imageFiles.map(file => uploadImage(file));
        const imageResults = await Promise.all(imageUploadPromises);
        // console.log(imageResults)
        const Image = imageResults.map(result => ({
            url: result.ImageUrl,
            PublicId: result.PublicId
        }));
        console.log(Image)
        const newCategory = new category({
            isActive: status,
            Image: {
                url: Image[0].url,
                PublicId: Image[0].PublicId
            },
            CategoryType,
            CategoryTitle
        });

        await newCategory.save();
        return ApiResponse.success(res, "Category created successfully", newCategory, 201);
    } catch (error) {
        console.error('Error creating Category:', error);
        return ApiResponse.error(res, "Failed to create Category", 500, error);
    }
});



exports.UpdateCategory = CatchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { CategoryTitle, CategoryType, status } = req.body;
        const imageFiles = req.files;

        // Find the existing category
        const banner = await category.findById(id);
        if (!banner) {
            return ApiResponse.error(res, "Category not found", 404);
        }

        // Check if banner.Image is an array before calling map()
        if (imageFiles && imageFiles.length > 0) {
            if (Array.isArray(banner.Image) && banner.Image.length > 0) {
                // Delete old images from Cloudinary if they exist
                await Promise.all(banner.Image.map(image => Cloudinary.uploader.destroy(image.PublicId)));
            }

            // Upload new images to Cloudinary
            const imageUploadPromises = imageFiles.map(file => uploadImage(file));
            const imageResults = await Promise.all(imageUploadPromises);

            // Transform image results to match the schema format
            const newImages = imageResults.map(result => ({
                url: result.ImageUrl, // Adjust field names if necessary
                PublicId: result.PublicId
            }));

            // Update banner images with new images
            banner.Image = {
                url: newImages[0].url,
                PublicId: newImages[0].PublicId
            };
        }

        // Update other fields if provided
        if (CategoryTitle) {
            banner.CategoryTitle = CategoryTitle;
        }
        if (CategoryType) {
            banner.CategoryType = CategoryType;
        }
        if (status) {
            banner.isActive = status
        }

        await banner.save();
        return ApiResponse.success(res, "Category updated successfully", banner);
    } catch (error) {
        console.error('Error updating Category:', error);
        return ApiResponse.error(res, "Failed to update Category", 500, error);
    }
});


// Delete  Category
exports.DeleteCategory = CatchAsync(async (req, res) => {
    try {
        const { id } = req.params;

        const banner = await category.findById(id);
        if (!banner) {
            return ApiResponse.error(res, "Category not found", 404);
        }
        console.log(banner)
        // Delete image from Cloudinary
        await Cloudinary.uploader.destroy(banner.Image.PublicId);

        await banner.deleteOne();
        return ApiResponse.success(res, "Category deleted successfully");
    } catch (error) {
        console.error('Error deleting Category:', error);
        return ApiResponse.error(res, "Failed to delete Category", 500, error);
    }
});

// Get All Active Category
exports.GetAllActiveCategory = CatchAsync(async (req, res) => {
    try {
        const { petType } = req.query;
        let categories;

        // Check if a specific petType is provided in the query
        if (petType) {
            categories = await category.find({ CategoryType: petType });
        } else {
            categories = await category.find();
        }

        return ApiResponse.success(res, categories, "Active categories fetched successfully");
    } catch (error) {
        console.error('Error fetching active categories:', error);
        return ApiResponse.error(res, "Failed to fetch active categories", 500, error);
    }
});


// Delete All Category
exports.DeleteAllCategory = CatchAsync(async (req, res) => {
    try {
        const banners = await category.find();
        const deletePromises = banners.map(async banner => {
            await cloudinary.v2.uploader.destroy(banner.Image.PublicId);
            await banner.remove();
        });

        await Promise.all(deletePromises);
        return ApiResponse.success(res, "All Category deleted successfully");
    } catch (error) {
        console.error('Error deleting all Category:', error);
        return ApiResponse.error(res, "Failed to delete all Category", 500, error);
    }
});