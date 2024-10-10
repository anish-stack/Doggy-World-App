const mongoose = require('mongoose');

const ServicesSchema = new mongoose.Schema({
    ServiceName: {
        type: String,
        required: [true, "Please provide the service name"],
        trim: true
    },
    Para: {
        type: String,
        required: [true, "Please provide a description for the service"],
        trim: true
    },
    Price: {
        type: String,
        required: [true, "Please provide the price"]
    },
    DiscountPrice: {
        type: String,
        required: [true, "Please provide the discount price"]
    },
    DiscountPercentage: {
        type: String,
        required: [true, "Please provide the discount percentage"]
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
    ServiceCategorey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    ServiceSpecilatity: [{
        type: String
    }],
    ServiceState: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServicesSchema);
