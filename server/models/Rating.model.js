const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    rating: {
        type: Number,
      
        max: 5,
        default: 1
    },
    feedback: {
        type: String,
        trim: true,
        maxlength: 500
    },
    typeOfRating: {
        type: [String],

    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorProfile'
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);
