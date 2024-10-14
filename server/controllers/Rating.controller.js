const CatchAsync = require('../middlewares/CatchAsync');
const DoctorModel = require('../models/Doctor.model');
const Rating = require('../models/Rating.model');

exports.CreateRating = CatchAsync(async (req, res) => {
    const { rating, feedback, typeOfRating, doctorId, appointmentId, serviceId, productId } = req.body;
    console.log(req.body)


    try {
        // Create a new rating
        const newRating = await Rating.create({
            rating,
            feedback,
            typeOfRating,
            doctorId,
            appointmentId,
            serviceId,
            productId
        });

        if (doctorId) {
            const checkDoctor = await DoctorModel.findById(doctorId);
            if (!checkDoctor) {
                return res.status(404).json({
                    success: false,
                    message: 'Doctor not found.'
                });
            } else {
                // Push new rating ID into the doctor's ratings array and save
                checkDoctor.rating.push(newRating._id);
                await checkDoctor.save(); // Don't forget to save the changes
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Rating created successfully.',
            data: newRating
        });
    } catch (error) {
        console.error('Error creating rating:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.'
        });
    }
});
