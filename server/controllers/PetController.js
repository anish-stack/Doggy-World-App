const PetModal = require('../models/Pet.model')
const axios = require('axios')
const CatchAsync = require('../middlewares/CatchAsync');
const sendMessage = require('../utils/SendSms');
const sendToken = require('../utils/SendToken');
const crypto = require('crypto')
const Address = require('../models/AddressModel')

exports.createPetProfile = CatchAsync(async (req, res) => {
    try {
        console.log("i am also hit")

        const { PetType, PetName, PetDob, PetAge, PetBreed, ContactNumber, Newsletter } = req.body;



        const emptyFields = [];


        if (!PetName) emptyFields.push('Pet Name is required.');
        if (!PetDob) emptyFields.push('Please provide your pet\'s date of birth.');
        if (PetAge === undefined) emptyFields.push('Pet Age is required.');
        if (!PetBreed) emptyFields.push('Pet Breed is required.');
        if (!ContactNumber) emptyFields.push('Contact Number is required.');

        if (emptyFields.length > 0) {
            return res.status(400).json({
                status: false,
                messages: emptyFields
            });
        }

        const checkMobileNumber = await PetModal.findOne({ ContactNumber });
        if (checkMobileNumber) {
            return res.status(403).json({
                status: false,
                message: "This contact number is already registered for another pet."
            });
        }

        const otp = crypto.randomInt(100000, 999999);
        const OtpExpiredTime = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes
        const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${ContactNumber}/${otp}/OTP1`);

        if (!sendOtpOnMobileNumber) {
            return res.status(403).json({
                status: false,
                message: "We couldn't send the OTP. Please try again."
            });
        }

        // Create the pet profile
        const newPetProfile = new PetModal({
            PetType,
            PetName,
            PetDob,
            PetAge,
            PetBreed,
            ContactNumber,
            Otp: otp,
            OtpExpireTime: OtpExpiredTime,
            Newsletter
        });

        // Save to the database
        await newPetProfile.save();

        return res.status(201).json({
            status: true,
            message: "Your pet profile has been created successfully! Please check your contact number to verify your OTP.",
            data: newPetProfile
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Oops! Something went wrong. Please try again later.",
            error: error.message
        });
    }
});

exports.VerifyOtp = CatchAsync(async (req, res) => {
    try {
        const { ContactNumber, otp, type } = req.body;

        // Check for required fields
        if (!ContactNumber || !otp) {
            return res.status(400).json({
                status: false,
                message: "Please provide both your contact number and the OTP."
            });
        }

        // Check ContactNumber
        const petProfile = await PetModal.findOne({ ContactNumber });

        if (!petProfile) {
            return res.status(404).json({
                status: false,
                message: "No pet profile found for this contact number. Please check and try again."
            });
        }

        // Check if OTP matches
        if (otp !== petProfile.Otp) {
            return res.status(400).json({
                status: false,
                message: "The OTP you entered is incorrect. Please try again."
            });
        }

        // Check if OTP is expired
        const currentTime = new Date();
        if (currentTime > petProfile.OtpExpireTime) {
            return res.status(400).json({
                status: false,
                message: "The OTP has expired. Please request a new one."
            });
        }

        if (type === "login") {

            await sendToken(petProfile, res, 200, "Login Successful");

        } else {
            // For other types (e.g., registration)
            petProfile.Otp = null;
            petProfile.isVerified = true;
            petProfile.OtpExpireTime = null;
            await petProfile.save()
            await sendToken(petProfile, res, 200, "OTP verified successfully! Your pet profile is now active.");
        }

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Oops! Something went wrong. Please try again later.",
            error: error.message
        });
    }
});


exports.resendOtp = CatchAsync(async (req, res) => {
    try {
        const { ContactNumber } = req.body;

        // Check for required fields
        if (!ContactNumber) {
            return res.status(400).json({
                status: false,
                message: "Please provide your contact number."
            });
        }

        // Check if pet profile exists
        const petProfile = await PetModal.findOne({ ContactNumber });

        if (!petProfile) {
            return res.status(404).json({
                status: false,
                message: "No pet profile found for this contact number."
            });
        }

        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999);
        const OtpExpiredTime = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

        // Send OTP via SMS
        const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${ContactNumber}/${otp}/OTP1`);

        if (!sendOtpOnMobileNumber) {
            return res.status(403).json({
                status: false,
                message: "Failed to send OTP. Please try again."
            });
        }

        // Update pet profile with new OTP and expiration time
        petProfile.Otp = otp;
        petProfile.OtpExpireTime = OtpExpiredTime;
        await petProfile.save();

        return res.status(200).json({
            status: true,
            message: "A new OTP has been sent to your contact number."
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Oops! Something went wrong. Please try again later.",
            error: error.message
        });
    }
});


exports.login = CatchAsync(async (req, res) => {
    try {
        const { ContactNumber } = req.body;

        // Check for required fields
        if (!ContactNumber) {
            return res.status(400).json({
                status: false,
                message: "Please provide your contact number."
            });
        }

        // Check if pet profile exists
        const petProfile = await PetModal.findOne({ ContactNumber });

        if (!petProfile) {
            return res.status(404).json({
                status: false,
                message: "No pet profile found for this contact number."
            });
        }

        // Check if the profile is verified
        if (!petProfile.isVerified) {
            return res.status(403).json({
                status: false,
                message: "Your pet profile is not verified yet. Please verify your OTP first."
            });
        }
        const otp = 123456
        // const otp = crypto.randomInt(100000, 999999);
        const OtpExpiredTime = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes
        // const sendOtpOnMobileNumber = await axios.get(`https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${ContactNumber}/${otp}/OTP1`);


        // if (!sendOtpOnMobileNumber) {
        //     return res.status(403).json({
        //         status: false,
        //         message: "We couldn't send the OTP. Please try again."
        //     });
        // }
        petProfile.Otp = otp
        petProfile.OtpExpireTime = OtpExpiredTime

        await petProfile.save();

        return res.status(201).json({
            status: true,
            message: "Otp sent Successful Please Enter a Otp !!",

        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Oops! Something went wrong. Please try again later.",
            error: error.message
        });
    }
});


exports.logout = CatchAsync(async (req, res) => {
    try {
        res.cookies('token'); // Clear the cookie containing the token

        return res.status(200).json({
            status: true,
            message: "You have been logged out successfully."
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Oops! Something went wrong. Please try again later.",
            error: error.message
        });
    }
});



exports.getMyProfile = CatchAsync(async (req, res) => {
    try {
        const user = req.user; // Assuming req.user is populated by a middleware
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }



        res.status(200).json({
            status: true,
            message: "My Profile",
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching the profile",
            error: error.message, // Return the error message for debugging (optional)
        });
    }
});


exports.AddAddress = CatchAsync(async (req, res) => {
    const pet = req.user.id._id;
    const findPet = await PetModal.findById(pet)
    try {
        if (!findPet) {
            return res.status(400).json({ message: 'Pet ID is required' });
        }
        console.log(req.body)
        const { StreetAddress, AddressType, City, Landmark, Pincode, state } = req.body;

        if (!StreetAddress || !City || !Pincode ||!Landmark ||  !state) {
            return res.status(400).json({ message: 'All fields are required: streetAddress, city, pincode, state' });
        }

        const address = new Address({
            streetAddress: StreetAddress,
            city: City,
            landmark: Landmark,
            pincode: Pincode,
            state,
            AddressType,
            PetId: pet,
        });
        findPet.Address.push(address._id);
        await findPet.save()
        await address.save()
        return res.status(201).json({ message: 'Address added successfully', address });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding address', error: error.message });
    }
});

exports.GetAddress = CatchAsync(async (req, res) => {
    const pet = req.user.id._id;

    try {
        const address = await Address.find({ PetId: pet });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        return res.status(200).json(address);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
});


exports.UpdateAddress = CatchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const address = await Address.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        return res.status(200).json({ message: 'Address updated successfully', address });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating address', error: error.message });
    }
});

exports.DeleteAddress = CatchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id._id; // Adjusting to get the user ID directly
    const pet = await PetModal.findById(userId); // Assuming you have a way to find the pet associated with the user

    if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
    }

    try {
        // Find and delete the address
        const address = await Address.findByIdAndDelete(id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Check if the deleted address was associated with the pet and update the pet model if necessary
        if (pet.Address && pet.Address.includes(id)) {
            pet.Address = pet.Address.filter(addressId => addressId.toString() !== id); // Remove the address ID from the pet's addresses
            await pet.save(); // Save the updated pet
        }

        return res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
});
