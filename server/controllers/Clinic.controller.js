const Clinic = require('../models/Clininc.model')
const doctors = require('../models/Doctor.model');
const Service = require('../models/Services.model'); // Corrected import
const CatchAsync = require('../middlewares/CatchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { uploadImage } = require('../middlewares/CloudinaryUpload');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || "do34gd7bu",
    api_key: process.env.CLOUDINARY_API_KEY || "658284914137226",
    api_secret: process.env.CLOUDINARY_SECRET_KEY || "MfABahlFqPWadh1EqS33JlgHicQ"
});
exports.CreateNewClinic = CatchAsync(async (req, res) => {
    try {
        const Lab_images = req.files;
        const {
            RepresentedPersonName,
            RepresentedPersonContactNumber,
            RepresentedEmail,
            Ratings,
            OpensTime,
            CloseTime,
            ContactNumber,
            Doctors,
            Services,
            longitude,
            latitude,
            OfficeNo,
            Landmark,
            streetAddress,
            MapLocation,
            isSundayOff
        } = req.body;

        // Check if Lab_images is empty
        if (!Lab_images || Lab_images.length === 0) {
            return res.status(400).json({
                status: "false",
                message: "No images provided"
            });
        }
        const existingClinic = await Clinic.findOne({ RepresentedEmail });
        if (existingClinic) {
            return res.status(400).json({
                status: "false",
                message: `A clinic with the email ${RepresentedEmail} already exists`
            });
        }
        // Parse Doctors and Services
        let DoctorsParsed, ServicesParsed;
        try {
            DoctorsParsed = JSON.parse(Doctors);
            ServicesParsed = JSON.parse(Services);
        } catch (error) {
            return res.status(400).json({
                status: "false",
                message: "Invalid format for Doctors or Services"
            });
        }

        // Validate required fields
        const missingFields = [];
        if (!Ratings) missingFields.push("Ratings");
        if (!ContactNumber) missingFields.push("Contact Number");
        if (!DoctorsParsed || DoctorsParsed.length === 0) missingFields.push("Doctors");
        if (!ServicesParsed || ServicesParsed.length === 0) missingFields.push("Services");
        if (!longitude) missingFields.push("Longitude");
        if (!latitude) missingFields.push("Latitude");
        if (!OfficeNo) missingFields.push("Office No");
        if (!Landmark) missingFields.push("Landmark");
        if (!streetAddress) missingFields.push("Street Address");
        if (!MapLocation) missingFields.push("Map Location");
        if (isSundayOff === undefined) missingFields.push("Sunday Off");

        if (missingFields.length > 0) {
            return res.status(422).json({
                status: "false",
                message: "Missing required fields",
                missingFields
            });
        }

        // Check if Doctors' IDs are valid
        for (const element of DoctorsParsed) {
            const DoctorCheck = await doctors.findById(element.value);
            if (!DoctorCheck) {
                return res.status(400).json({
                    status: "false",
                    message: `Doctor with ID ${element.value} not found`
                });
            }
        }

        // Check if Services' IDs are valid
        for (const element of ServicesParsed) {
            const ServiceCheck = await Service.findById(element.value);
            if (!ServiceCheck) {
                return res.status(400).json({
                    status: "false",
                    message: `Service with ID ${element.value} not found`
                });
            }
        }

        // Upload images to Cloudinary
        const imageUploadPromises = Lab_images.map(file => uploadImage(file));
        const imageResults = await Promise.all(imageUploadPromises);

        // Extract only the values for Doctors and Services
        const doctorsValues = DoctorsParsed.map(doctor => doctor.value);
        const servicesValues = ServicesParsed.map(service => service.value);

        // Save clinic information to the database
        const newClinic = await Clinic.create({
            RepresentedPersonName,
            RepresentedPersonContactNumber,
            RepresentedEmail,
            Ratings,
            OpensTime,
            CloseTime,
            ContactNumber,
            Doctors: doctorsValues,
            Services: servicesValues,
            longitude,
            latitude,
            OfficeNo,
            Landmark,
            streetAddress,
            MapLocation,
            isSundayOff,
            Images: imageResults.map(result => ({
                url: result?.ImageUrl,
                PublicId: result?.PublicId
            }))
        });

        res.status(201).json({
            status: "success",
            message: "Branch created successfully",
            data: newClinic
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                status: "false",
                message: "Duplicate email detected, please use a different email."
            });
        }

        res.status(500).json({
            status: "error",
            message: "An error occurred while creating the clinic",
            error: error.message
        });

    }
});

exports.GetSingleClinic = CatchAsync(async (req, res) => {
    try {
        const { isSundayOff, Ratings, CreatesAt, RepresentedPersonName, ContactNumber, Services } = req.query
        const { id } = req.params;
        if (!id) {
            return res.status(402).json({
                success: false,
                message: 'Please Provide a id to Get Details Of  a Branch'
            })
        }

        const clinic = await Clinic.findById(id).populate('Doctors Services');

        if (!clinic) {
            return res.status(404).json({
                status: "false",
                message: "Clinic not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: clinic
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while creating the clinic",
            error: error.message
        });
    }
});

exports.GetAllClinic = CatchAsync(async (req, res) => {
    try {
        const { isSundayOff, Ratings, CreatedAt, RepresentedPersonName, ContactNumber, Services } = req.query;

        // Build the query object
        const query = {};

        // Add filters based on provided query parameters
        if (isSundayOff) {
            query.isSundayOff = isSundayOff === 'true'; // Convert to boolean if necessary
        }
        if (Ratings) {
            query.Ratings = { $gte: Ratings }; // Assuming you want to find clinics with Ratings greater than or equal to the provided value
        }
        if (CreatedAt) {
            query.CreatedAt = { $gte: new Date(CreatedAt) }; // Assuming CreatedAt is a date string
        }
        if (RepresentedPersonName) {
            query.RepresentedPersonName = new RegExp(RepresentedPersonName, 'i'); // Case-insensitive search
        }
        if (ContactNumber) {
            query.ContactNumber = new RegExp(ContactNumber, 'i'); // Case-insensitive search
        }
        if (Services) {
            // If Services is provided, find clinics that have these services
            const serviceIds = Services.split(',').map(service => service.trim()); // Assuming comma-separated service IDs
            query.Services = { $in: serviceIds }; // Match clinics that provide any of the specified services
        }

        // Fetch clinics based on the constructed query
        const clinics = await Clinic.find(query).populate('Doctors Services');

        // If no clinics found
        if (!clinics.length) {
            return res.status(404).json({
                status: "false",
                message: "No clinics found matching the criteria"
            });
        }

        // Return the fetched clinics
        res.status(200).json({
            status: "success",
            data: clinics
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error occurred while retrieving clinics",
            error: error.message
        });
    }
});

exports.UpdateClinic = CatchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(402).json({
                success: false,
                message: 'Please Provide a id to Update a Branch'
            })
        }
        const {
            RepresentedPersonName,
            RepresentedPersonContactNumber,
            Ratings,
            OpensTime,
            CloseTime,
            ContactNumber,
            Doctors,
            Services,
            longitude,
            latitude,
            OfficeNo,
            Landmark,
            streetAddress,
            MapLocation,
            isSundayOff
        } = req.body;

        const updatedClinicData = {};

        // Update fields only if they are provided
        if (RepresentedPersonName) updatedClinicData.RepresentedPersonName = RepresentedPersonName;
        if (RepresentedPersonContactNumber) updatedClinicData.RepresentedPersonContactNumber = RepresentedPersonContactNumber;
        if (Ratings) updatedClinicData.Ratings = Ratings;
        if (OpensTime) updatedClinicData.OpensTime = OpensTime;
        if (CloseTime) updatedClinicData.CloseTime = CloseTime;
        if (ContactNumber) updatedClinicData.ContactNumber = ContactNumber;
        if (longitude) updatedClinicData.longitude = longitude;
        if (latitude) updatedClinicData.latitude = latitude;
        if (OfficeNo) updatedClinicData.OfficeNo = OfficeNo;
        if (Landmark) updatedClinicData.Landmark = Landmark;
        if (streetAddress) updatedClinicData.streetAddress = streetAddress;
        if (MapLocation) updatedClinicData.MapLocation = MapLocation;
        if (isSundayOff !== undefined) updatedClinicData.isSundayOff = isSundayOff;

        // Handle updating Doctors and Services if provided
        if (Doctors) {
            try {
                updatedClinicData.Doctors = Doctors.map(doctor => doctor.value);
            } catch (error) {
                return res.status(400).json({
                    status: "false",
                    message: "Invalid format for Doctors"
                });
            }
        }

        if (Services) {
            try {
                updatedClinicData.Services = Services.map(service => service.value);
            } catch (error) {
                return res.status(400).json({
                    status: "false",
                    message: "Invalid format for Services"
                });
            }
        }



        // Update the clinic in the database
        const updatedClinic = await Clinic.findByIdAndUpdate(id, updatedClinicData, { new: true, runValidators: true });

        if (!updatedClinic) {
            return res.status(404).json({
                status: "false",
                message: "Clinic not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Branch updated successfully",
            data: updatedClinic
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                status: "false",
                message: "Duplicate email detected, please use a different email."
            });
        }

        res.status(500).json({
            status: "error",
            message: "An error occurred while creating the clinic",
            error: error.message
        });
    }
});

exports.DeleteClinic = CatchAsync(async (req, res) => {
    const { id } = req.params;
    // console.log("i am hit")
    // console.log(id)
    // Find the clinic by ID
    const clinicToDelete = await Clinic.findById(id);

    if (!clinicToDelete) {
        return res.status(404).json({
            status: "false",
            message: "Clinic not found"
        });
    }

    // Delete images from Cloudinary
    const imageDeletePromises = clinicToDelete.Images.map(image => {
        return cloudinary.uploader.destroy(image.PublicId);
    });

    try {
        await Promise.all(imageDeletePromises);

        await Clinic.findByIdAndDelete(id);

        res.status(200).json({
            status: "success",
            message: "Clinic and associated images deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while deleting the clinic and images",
            error: error.message
        });
    }
});

exports.GetClimicByServiceId = CatchAsync(async (req, res) => {
    const { servicesId } = req.query;
    console.log(servicesId)
    // Check if servicesId is provided
    if (!servicesId) {
        return res.status(400).json({
            status: "false",
            message: "Services ID is required"
        });
    }

    // Fetch clinics based on the service ID
    const clinics = await Clinic.find({ Services: { $in: [servicesId] } }).populate('Doctors Services'); 
       
    // If no clinics found
    if (!clinics.length) {
        return res.status(404).json({
            status: "false",
            message: "No clinics found for the provided service ID"
        });
    }

    // Return the fetched clinics
    res.status(200).json({
        status: "success",
        data: clinics
    });
});
