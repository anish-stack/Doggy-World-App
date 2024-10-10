const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    PetType: {
        type: String,
        required: true,
        enum: ["Dog", "Cat", "dog", "cat"]
    },
    PetName: {
        type: String,
        required: true
    },
    PetDob: {
        type: Date,
        required: true
    },
    PetAge: {
        type: Number,
        required: true
    },
    PetBreed: {
        type: String,
        required: true
    },
    ContactNumber: {
        type: String,
        required: true
    },
    Otp: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    Newsletter: {
        type: Boolean,
        default: false
    },
    OtpExpireTime: {
        type: Date
    },
    Address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }
    ]
}, { timestamps: true });

PetSchema.index({ ContactNumber: 1 });


module.exports = mongoose.model('Pet', PetSchema);
