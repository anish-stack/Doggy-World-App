const express = require('express');
const { createPetProfile, VerifyOtp, resendOtp, login, logout, getMyProfile, AddAddress, GetAddress, UpdateAddress, DeleteAddress } = require('../controllers/PetController');
const router = express.Router();
const Protect = require('../middlewares/Auth');
const { getMyBookings, GetMyAppoinment, CancelAppoinment } = require('../controllers/BookingController');


router.post('/pet-register', createPetProfile)
router.post('/pet-register-VerifyOtp', VerifyOtp)
router.post('/pet-register-resendOtp', resendOtp)
router.post('/pet-login', login)
router.get('/pet-logout', logout)
router.get('/pet-profile', Protect, getMyProfile)

// address routes
router.post('/add-address', Protect, AddAddress)
router.get('/get-address', Protect, GetAddress)
router.post('/update-address/:id', Protect, UpdateAddress)
router.delete('/remove-address/:id', Protect, DeleteAddress)



router.get('/get-my-bookings', Protect, getMyBookings)
router.get('/get-my-Appoinment', Protect, GetMyAppoinment)
router.post('/cancel-my-Appoinment', Protect, CancelAppoinment)











module.exports = router;