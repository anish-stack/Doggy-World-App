const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'DoctorProfile',
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pet',
    },
    paymentType:{
        type: String,
    },
    isPaymentDone:{
        type: Boolean,
        default:false,
    },
    typeOfAppointment: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
    },
    fee: {
        type: Number,
        required: true,
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    status: {
        type: String,
        required: true,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
        default: 'Scheduled',
    },

    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
