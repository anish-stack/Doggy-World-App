const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/user.model');
const otpGenerator = require('otp-generator');
const CatchAsync = require('../middlewares/CatchAsync');
const sendMessage = require('../utils/SendSms');
const sendToken = require('../utils/SendToken');

// Sign up User For First Time
exports.SignUp = CatchAsync(async (req, res) => {
    const { Contact, Password } = req.body;

    if (!Contact || !Password) {
        return ApiResponse.error(res, "Please fill all required fields", 400);
    }

    // Check if the user already exists
    const isUserPresent = await User.findOne({ Contact });

    if (isUserPresent) {
        if (isUserPresent.isContactNumberVerified === false) {
            // Generate OTP
            const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
            const OtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

            // Send OTP to the user
            const options = {
                message: `Your Re-Verification OTP code is ${otp}`,
                Contact
            }
            try {
                await sendMessage(options);
            } catch (error) {
                console.log(error)
                return ApiResponse.error(res, "Failed to send OTP", 500, error);
            }
            // Update OTP and expiry time for the existing user
            isUserPresent.Password = Password
            isUserPresent.ContactNumberVerifiedOtp = otp;
            isUserPresent.ContactOtpExpiresAt = OtpExpiresAt;
            await isUserPresent.save();

            return ApiResponse.success(res, { Contact }, "Re-Verification OTP sent successfully", 200);
        } else {
            return ApiResponse.error(res, "User already exists and contact number is verified", 400);
        }
    }

    // Create new user if not present
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const OtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    const newUser = new User({
        Contact,
        Password,
        ContactNumberVerifiedOtp: otp,
        ContactOtpExpiresAt: OtpExpiresAt
    });

    await newUser.save();
    const options = {
        message: `Your OTP code is ${otp}`,
        Contact
    }
    // Send OTP to the new user
    try {
        await sendMessage(options);
    } catch (error) {
        console.log(error)
        return ApiResponse.error(res, "Failed to send OTP", 500, error);
    }
    // Respond with success message
    return ApiResponse.success(res, { Contact }, "User registered successfully, OTP sent", 201);
});
// Verify OTP
exports.VerifyOtp = CatchAsync(async (req, res) => {
    const { Contact, otp } = req.body;

    if (!Contact || !otp) {
        return ApiResponse.error(res, "Please provide contact number and OTP", 400);
    }

    // Find the user by contact number
    const user = await User.findOne({ Contact });

    if (!user) {
        return ApiResponse.error(res, "User not found", 404);
    }

    // Check if OTP is expired
    if (new Date() > user.ContactOtpExpiresAt) {
        return ApiResponse.error(res, "OTP has expired", 400);
    }

    // Verify OTP
    if (user.ContactNumberVerifiedOtp !== otp) {
        return ApiResponse.error(res, "Invalid OTP", 400);
    }

    // Mark contact number as verified
    user.isContactNumberVerified = true;
    user.ContactNumberVerifiedOtp = null;
    user.ContactOtpExpiresAt = null;
    await user.save();

    // Generate and send JWT token
    await sendToken(user, res, 200);
});
// Resend OTP
exports.ResendOtp = CatchAsync(async (req, res) => {
    const { Contact } = req.body;

    if (!Contact) {
        return ApiResponse.error(res, "Please provide contact number", 400);
    }

    // Find the user by contact number
    const user = await User.findOne({ Contact });

    if (!user) {
        return ApiResponse.error(res, "User not found", 404);
    }

    if (user.isContactNumberVerified) {
        return ApiResponse.error(res, "Contact number is already verified", 400);
    }

    // Generate new OTP and expiry time
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const OtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // Send OTP to the user
    const options = {
        message: `Your new OTP code is ${otp}`,
        Contact
    };

    try {
        await sendMessage(options);
    } catch (error) {
        console.log(error);
        return ApiResponse.error(res, "Failed to send OTP", 500, error);
    }

    // Update OTP and expiry time for the existing user
    user.ContactNumberVerifiedOtp = otp;
    user.ContactOtpExpiresAt = OtpExpiresAt;
    await user.save();

    return ApiResponse.success(res, { Contact }, "New OTP sent successfully", 200);
});
// Sign In User
exports.SignIn = CatchAsync(async (req, res) => {
    const { Contact, Password } = req.body;

    if (!Contact || !Password) {
        return ApiResponse.error(res, "Please fill all required fields", 400);
    }

    // Find the user by contact number
    const user = await User.findOne({ Contact });

    if (!user) {
        return ApiResponse.error(res, "User not found", 404);
    }

    if (!user.isContactNumberVerified) {
        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const OtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

        // Send OTP to the user
        const options = {
            message: `Your Re-Verification OTP code is ${otp}`,
            Contact
        };

        try {
            await sendMessage(options);
        } catch (error) {
            console.log(error);
            return ApiResponse.error(res, "Failed to send OTP", 500, error);
        }

        // Update OTP and expiry time for the existing user
        user.ContactNumberVerifiedOtp = otp;
        user.ContactOtpExpiresAt = OtpExpiresAt;
        await user.save();

        return ApiResponse.success(res, { Contact }, "Re-Verification OTP sent successfully", 200);
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(Password);

    if (!isMatch) {
        return ApiResponse.error(res, "Invalid password", 400);
    }

    // Generate and send JWT token
    await sendToken(user, res, 200);

});

// Password Change Request
exports.PasswordChangeRequest = CatchAsync(async (req, res) => {
    const { Contact } = req.body;

    if (!Contact) {
        return ApiResponse.error(res, "Please provide contact number", 400);
    }

    // Find the user by contact number
    const user = await User.findOne({ Contact });

    if (!user) {
        return ApiResponse.error(res, "User not found", 404);
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Send OTP to the user
    const options = {
        message: `Your OTP code for password change is ${otp}`,
        Contact
    };
    try {
        await sendMessage(options);
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        return ApiResponse.error(res, "Failed to send OTP", 500, error);
    }

    // Save OTP and expiry time to user's record
    user.PasswordResetVerifiedOtp = otp;
    user.PasswordResetOtpExpiresAt = otpExpiresAt;
    await user.save();

    return ApiResponse.success(res, { Contact }, "OTP sent successfully", 200);
});

// Password Change OTP Verification
exports.VerifyPasswordChangeOtp = CatchAsync(async (req, res) => {
    const { Contact, otp, newPassword } = req.body;

    if (!Contact || !otp || !newPassword) {
        return ApiResponse.error(res, "Please provide contact number, OTP, and new password", 400);
    }

    // Find the user by contact number
    const user = await User.findOne({ Contact });

    if (!user) {
        return ApiResponse.error(res, "User not found", 404);
    }

    // Check if OTP is expired
    if (new Date() > user.PasswordResetOtpExpiresAt) {
        return ApiResponse.error(res, "OTP has expired", 400);
    }

    // Verify OTP
    if (user.PasswordResetVerifiedOtp !== otp) {
        return ApiResponse.error(res, "Invalid OTP", 400);
    }

    // Update password
    user.Password = newPassword; // Hash the password before saving in production
    user.PasswordResetVerifiedOtp = null;
    user.PasswordResetOtpExpiresAt = null;
    await user.save();

    return ApiResponse.success(res, { Contact }, "Password changed successfully", 200);
});


exports.Logout = CatchAsync(async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0), // Set expiration date to the past
            // secure: process.env.NODE_ENV === 'production' // Secure cookie only in production
        });

        return ApiResponse.success(res, {}, "Logout successful", 200);
    } catch (error) {
        console.error('Error during logout:', error.message);
        return ApiResponse.error(res, "Logout failed", 500, error);
    }
});