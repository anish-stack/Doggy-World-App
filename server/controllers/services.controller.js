const Service = require('../models/Services.model'); // Corrected import
const CatchAsync = require('../middlewares/CatchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { uploadImage } = require('../middlewares/CloudinaryUpload');

exports.CreateService = CatchAsync(async (req, res) => {
    const serviceImages = req.files; // Expecting multiple images
    // console.log(serviceImages);

    // Check if any images were uploaded
    if (!serviceImages || serviceImages.length === 0) {
        return ApiResponse.error(res, "Please upload at least one image", 400);
    }

    const { ServiceName, ServiceSpecilatity, ServiceCategorey, ServiceState, Para, Price, DiscountPrice, DiscountPercentage } = req.body;
    const serviceSpecialityArray = ServiceSpecilatity.split(',');
    const trimmedServiceSpecialityArray = serviceSpecialityArray.map(item => item.trim());
    const missingFields = [];
    if (!ServiceName) missingFields.push("ServiceName");
    // if (!Para) missingFields.push("Para");
    if (!DiscountPrice) missingFields.push("DiscountPrice");
    if (!DiscountPercentage) missingFields.push("DiscountPercentage");
    if (!Price) missingFields.push("Price");
    if (!ServiceSpecilatity) missingFields.push("Service Specilatity");


    if (missingFields.length > 0) {
        console.log(`Missing fields: ${missingFields.join(", ")}`)
        return ApiResponse.error(res, `Missing fields: ${missingFields.join(", ")}`, 400);
    }

    try {
        // Upload all images and collect their results
        const imageUploadPromises = serviceImages.map(file => uploadImage(file));
        const imageResults = await Promise.all(imageUploadPromises);
        // Debugging log

        // Prepare arrays to hold image URLs and Public IDs
        const images = [];

        imageResults.forEach(result => {
            // Check if the result has both ImageUrl and PublicId
            if (result.ImageUrl && result.PublicId) {
                images.push({
                    url: result.ImageUrl,
                    PublicId: result.PublicId
                });
            }
        });

        // If no valid images were uploaded, set a default image
        if (images.length === 0) {
            images.push({
                url: "https://i.ibb.co/VHKHCrD/doctor-men.png", // Default image URL
                PublicId: 'Error While Uploading Images - No Public ID'
            });
        }
        // console.log("images",); 
        // Create a new Service record
        const newService = new Service({
            ServiceName,
            Para,
            ServiceCategorey,
            ServiceSpecilatity:trimmedServiceSpecialityArray,
            DiscountPrice,
            DiscountPercentage,
            Price,
            ServiceState,
            Images: images // Store all images with their URLs and Public IDs
        });

        const savedService = await newService.save();

        // Return a success response
        return ApiResponse.success(res, savedService, 201);
    } catch (error) {
        console.error(error);
        return ApiResponse.error(res, "Internal server error", 500);
    }
});



exports.UpdateService = CatchAsync(async (req, res) => {
    const { id } = req.params;
    const { ServiceName, Para,ServiceSpecilatity, Price, DiscountPrice, DiscountPercentage } = req.body;
    const serviceImage = req.files;

    try {
        let updatedService = await Service.findById(id);

        if (!updatedService) {
            return ApiResponse.error(res, "Service not found", 404);
        }

        // Only update fields if they are provided in the request body
        if (ServiceName !== undefined) updatedService.ServiceName = ServiceName;
        if (Para !== undefined) updatedService.Para = Para;
        if (Price !== undefined) updatedService.Price = Price;
        if (DiscountPrice !== undefined) updatedService.DiscountPrice = DiscountPrice;
        if (DiscountPercentage !== undefined) updatedService.DiscountPercentage = DiscountPercentage;
        if (ServiceSpecilatity !== undefined) updatedService.ServiceSpecilatity = ServiceSpecilatity;


        // Only update image if a new image is uploaded
        if (serviceImage && serviceImage.length > 0) {
            const imageUploadPromises = serviceImage.map(file => uploadImage(file));
            const imageResults = await Promise.all(imageUploadPromises);

            if (imageResults.length > 0 && imageResults[0].ImageUrl && imageResults[0].PublicId) {
                updatedService.Image = {
                    url: imageResults[0].ImageUrl,
                    PublicId: imageResults[0].PublicId
                };
            } else {
                updatedService.Image = {
                    url: "https://i.ibb.co/VHKHCrD/doctor-men.png",
                    PublicId: 'Error While Uploading Image No Public id'
                };
            }
        }

        const savedService = await updatedService.save();

        return ApiResponse.success(res, savedService, 200);
    } catch (error) {
        console.error(error);
        return ApiResponse.error(res, "Internal server error", 500);
    }
});


exports.DeleteService = CatchAsync(async (req, res) => {
    const { id } = req.params;

    try {
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return ApiResponse.error(res, "Service not found", 404);
        }

        return ApiResponse.success(res, "Service deleted successfully", 200);
    } catch (error) {
        console.error(error);
        return ApiResponse.error(res, "Internal server error", 500);
    }
});

exports.getAllService = CatchAsync(async (req, res) => {
    try {
        const services = await Service.find().populate('ServiceCategorey');

        if (!services || services.length === 0) {
            return ApiResponse.error(res, "No services found", 404);
        }

        return ApiResponse.success(res, services, 200);
    } catch (error) {
        console.error(error);
        return ApiResponse.error(res, "Internal server error", 500);
    }
});

exports.getSingleService = CatchAsync(async (req, res) => {
    const { id } = req.params;

    try {
        const service = await Service.findById(id);

        if (!service) {
            return ApiResponse.error(res, "Service not found", 404);
        }

        return ApiResponse.success(res, service, 200);
    } catch (error) {
        console.error(error);
        return ApiResponse.error(res, "Internal server error", 500);
    }
});
