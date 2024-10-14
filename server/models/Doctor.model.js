const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const doctorProfileSchema = new mongoose.Schema({
    // Basic Details
    ProfileImage: {
        url: {
            type: String,

        },
        PublicId: {
            type: String
        }
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    speciality: {
        type: String
    },
    HigherEduction: {
        type: String
    },
    OverAllExperince: {
        type: String
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    displayName: {
        type: String,
        trim: true,
    },

    designation: {
        type: String,
        trim: true,
    },

    phoneNumbers: {
        type: String,
        required: true,
        unique: true,
    },

    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    knownLanguages: [String],

    // Experience Details
    experience: [{
        hospitalName: String,
        title: String,
        yearOfExperience: Number,
        location: String,
        employment: String,
        jobDescription: String,
        startDate: {
            type: Date,
            required: true,
        },
        endDate: Date,
    }],

    // Education Details 
    education: [{
        institutionName: String,
        course: String,
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        years: Number
    }],


    // Clinics Details 
    clinics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    }],

    businessHours: [{
        day: {
            type: [String],
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        }
    }],
    doctorDescription: {
        type: String,
        required: true,
    },
    feeStart: String,

    // feeStructure: [{
    //     serviceName: String,
    //     fee: String,
    // }],

    commissionOnPerAppointment: String,

    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],

    rating: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }],

    whichBranchDoctor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    }],

    joinedDate: {
        type: Date
    },

    isBlocked: {
        type: Boolean,
        default: false,
    },

    password: {
        type: String,
        required: true,
    },
    isBestDoctor: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true,
});


doctorProfileSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


doctorProfileSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
