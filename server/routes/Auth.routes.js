const express = require('express');
const router = express.Router();
const multer = require('multer');
const { SignUp, VerifyOtp, ResendOtp, SignIn, PasswordChangeRequest, VerifyPasswordChangeOtp, Logout } = require('../controllers/auth.controller');
const Protect = require('../middlewares/Auth');
const { CreateOrder } = require('../controllers/BookingController');

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

//====================User Routes====================
router.post('/Sign-up', SignUp)
router.post('/Verify-Otp', VerifyOtp)
router.post('/resend-Otp', ResendOtp)
router.post('/Sign-in', SignIn)
router.post('/Password-Change-request', PasswordChangeRequest)
router.post('/Password-Change-Verify-Otp', VerifyPasswordChangeOtp)
router.post('/Logout', Protect, Logout)


//====================Payment Routes====================

router.post('/Create-Order', Protect, CreateOrder)



module.exports = router;
