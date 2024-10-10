const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { CreateService, getAllService, getSingleService, UpdateService, DeleteService } = require('../controllers/services.controller');
const { MakeANewSDoctorRegistration, GetAllDoctor, GetDoctorInformation } = require('../controllers/doctors.controller');
const { CreateNewClinic, GetAllClinic, GetSingleClinic, UpdateClinic, DeleteClinic, GetClimicByServiceId } = require('../controllers/Clinic.controller');

//====================Doctors Routes ====================
router.post('/Create-doctor', upload.array('images'), MakeANewSDoctorRegistration);
router.get('/get-doctor', GetAllDoctor);
router.get('/get-doctor/:id', GetDoctorInformation);



//=====================================

//====================Services Routes ====================
router.post('/Create-Service', upload.array('images'), CreateService);
router.get('/Get-Services', getAllService);
router.get('/Get-Service-By/:id', getSingleService);
router.put('/Update-Service/:id', upload.array('images'), UpdateService);
router.delete('/Delete-Service/:id', DeleteService);




//====================Branch Routes ====================
router.post('/Create-Branch', upload.array('images'), CreateNewClinic);
router.get('/Get-Branch', GetAllClinic);
router.get('/Get-Single-Branch/:id', GetSingleClinic);
router.post('/update-Branch/:id', UpdateClinic);
router.get('/Get-Branch-Service', GetClimicByServiceId);

router.delete('/delete-Branch/:id', DeleteClinic);



module.exports = router;
