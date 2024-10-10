const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pet',
    },
    petType: {
        type: String,
        required: true,
    },
    petAge: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    typeOfAppointment: {
        type: String,
        required: true,
        enum: ['Check-up', 'Vaccination', 'Surgery', 'Grooming', 'Other'],
    },
    discountApplied: {
        type: Boolean,
        default: false,
    },
    discountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discount',
    },
    fee: {
        type: Number,
        required: true,
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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
