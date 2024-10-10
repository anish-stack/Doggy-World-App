const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({
    RepresentedPersonName: {
        type: String,
        trim: true,
        required: [true, "Please Enter A Name"]
    },
    RepresentedPersonContactNumber: {
        type: Number,
        trim: true,
        required: [true, "Please Enter Valid Contact Number"]
    },
    RepresentedEmail: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Please Enter Valid Email id"]
    },
    Images: [
        {
            url: {
                type: String,
                required: [true, "Please provide the image URL"]
            },
            PublicId: {
                type: String,
                required: [true, "Please provide the public ID"]
            }
        }
    ],
    OpensTime: {
        type: String,
        required: [true, "Please provide the opening Time"]
    },
    CloseTime: {
        type: String,
        required: [true, "Please provide the  closing times"]
    },
    ContactNumber: {
        type: String,
        required: [true, "Please provide a contact number"]
    },
    Doctors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DoctorProfile',

        }
    ],
    Services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: [true, "Please provide at least one service"]
        }
    ],
    longitude: {
        type: Number,
        required: [true, "Please provide the longitude"]
    },
    latitude: {
        type: Number,
        required: [true, "Please provide the latitude"]
    },
    Ratings: {
        type: Number,
        default: "0"
    },
    OfficeNo: {
        type: String,
        required: [true, "Please provide the office number"]
    },
    Landmark: {
        type: String,
        required: [true, "Please provide the landmark"]
    },
    streetAddress: {
        type: String,
        required: [true, "Please provide the street address"]
    },

    MapLocation: {
        type: String,
        required: [true, "Please provide the map location URL"]
    },
    isSundayOff: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

module.exports = mongoose.model('Clinic', ClinicSchema);
