const doctors = require('../models/Doctor.model');
const CatchAsync = require('../middlewares/CatchAsync');
const ApiResponse = require('../utils/ApiResponse');
const { uploadImage } = require('../middlewares/CloudinaryUpload');

exports.MakeANewSDoctorRegistration = CatchAsync(async (req, res) => {
    try {
        const ProfileImage = req.files;
        if (!ProfileImage) {
            return res.status(403).json({
                success: false,
                message: 'Profile image is required'
            });
        }


        const {
            firstName,
            lastName,
            displayName,
            designation,
            phoneNumbers,
            emailAddress,
            knownLanguages,
            experience,
            education,
            businessHours,
            commissionOnPerAppointment,
            password,
            speciality,
            HigherEduction,
            OverAllExperince,
            doctorDescription,
            isBestDoctor,
            feeStart
        } = req.body;
        const Parsedexperience = JSON.parse(experience)
        const ParsedLanguage = JSON.parse(knownLanguages)

        const ParsedEducation = JSON.parse(education)
        const ParsedBusiinesshour = JSON.parse(businessHours)

        // Check for empty fields
        const emptyFields = [];
        if (!firstName) emptyFields.push('firstName');
        if (!lastName) emptyFields.push('lastName');
        if (!displayName) emptyFields.push('displayName');
        if (!designation) emptyFields.push('designation');
        if (!phoneNumbers || phoneNumbers.length === 0) emptyFields.push('phoneNumbers');
        if (!emailAddress) emptyFields.push('emailAddress');
        if (!knownLanguages || knownLanguages.length === 0) emptyFields.push('knownLanguages');
        if (!Parsedexperience) emptyFields.push('experience');
        if (!ParsedEducation) emptyFields.push('education');
        if (!ParsedBusiinesshour) emptyFields.push('businessHours');
        if (!commissionOnPerAppointment) emptyFields.push('commissionOnPerAppointment');
        if (!password) emptyFields.push('password');
        if (!feeStart) emptyFields.push('feeStart');
        if (isBestDoctor === undefined) emptyFields.push('isBestDoctor');

        if (emptyFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in the following fields: ' + emptyFields.join(', '),
            });
        }

        const ExistDoctor = await doctors.findOne({
            $or: [
                { emailAddress },
                { phoneNumbers: { $in: phoneNumbers } }
            ]
        });
        console.log(ExistDoctor)
        if (ExistDoctor) {
            return res.status(400).json({
                success: false,
                message: 'A doctor with this email or phone number already exists.',
            });
        }

        let profileImageUrl = '';
        let profileIPublicId = '';

        if (ProfileImage && ProfileImage.length > 0) {
            const imageUploadPromises = ProfileImage.map(file => uploadImage(file));
            const imageResults = await Promise.all(imageUploadPromises);
            profileImageUrl = imageResults[0]?.ImageUrl
            profileIPublicId = imageResults[0]?.PublicId
        }

        const newDoctor = await doctors.create({
            firstName,
            lastName,
            displayName,
            designation,
            phoneNumbers,
            emailAddress,
            knownLanguages: ParsedLanguage,
            experience: Parsedexperience,
            education: ParsedEducation,
            businessHours: ParsedBusiinesshour,
            commissionOnPerAppointment,
            password,
            speciality,
            doctorDescription,
            HigherEduction,
            OverAllExperince,
            isBestDoctor,
            feeStart,
            ProfileImage: {
                url: profileImageUrl,
                PublicId: profileIPublicId
            }
        });

        // Send a success response
        return res.status(201).json({
            success: true,
            message: 'Doctor registered successfully',
            data: newDoctor
        });
    } catch (error) {
        // Handle server errors
        console.error('Error registering doctor:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while registering the doctor',
            error: error.message
        });
    }
});



exports.GetAllDoctor = CatchAsync(async (req, res) => {
    try {
        const { isBestDoctor, designation, feeStart, joinedDate, isActive } = req.query;


        const query = {};

        if (isBestDoctor !== undefined) {
            query.isBestDoctor = isBestDoctor === 'true';
        }

        if (designation) {
            query.designation = designation;
        }

        if (feeStart) {
            query.feeStart = { $gte: parseFloat(feeStart) };
        }

        if (joinedDate) {
            query.joinedDate = { $gte: new Date(joinedDate) }; // Filters doctors by joined date
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const doctorsList = await doctors.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: doctorsList
        });

    } catch (error) {
        console.error('Error fetching doctors:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching doctors',
            error: error.message
        });
    }
});

exports.GetDoctorInformation = CatchAsync(async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID is required',
            });
        }

        // Fetch doctor information by ID
        const doctorProvide = await doctors.findById(id);

        // Check if doctor exists
        if (!doctorProvide) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        // Return success with doctor data
        return res.status(200).json({
            success: true,
            data: doctorProvide, // Corrected from doctorsList to doctorProvide
        });

    } catch (error) {
        console.error('Error fetching doctor information:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching doctor information',
            error: error.message,
        });
    }
});
