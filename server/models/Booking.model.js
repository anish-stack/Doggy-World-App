const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    BookingType: {
        type: String,
        enum: ['Service', 'ProductPurchase', 'Appointment', 'Other'],
        required: true
    },
    ServiceId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",

    }],
    ClinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",

    },
    DoctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorProfile"
    },
    ProductIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    ServiceAndAppointmentTimeAndDate: {

        type: String

    },
    PaymentInfo: {
        PaymentMode: {
            type: String,
            enum: ['online', 'Online', 'Pay After Service', 'payAfterService'],
            required: true
        },
        PaymentAmount: {
            type: Number,
            required: true
        },
        TransactionId: {
            type: String
        },
        PaymentStatus: {
            type: String,
            enum: ['success', 'pending', 'failed', 'not-initiated'],
            default: 'pending'
        },
        PaymentVia: {
            type: String,
            enum: ['app', 'web'],
            required: true
        }
    },
    Address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    },
    OrderDetails: {
        OrderDate: {
            type: Date,
            default: Date.now
        },
        OrderStatus: {
            type: String,
            enum: ["Order Placed", "Accepted", "CanceledByUser", "CanceledByAdmin", "ReadyToShip", "Dispatched", "Returned", "Delivered"],
            default: "Order Placed"
        },
        ReturnDate: {
            type: Date
        },
        OrderType: {
            type: String,
            enum: ['Home Visit', 'Clinic Visit', 'Call', 'Video Call', 'Product-Order']
        }
    },
    CustomerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet",
        required: true
    },
    Notes: {
        type: String
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    UpdatedAt: {
        type: Date,
        default: Date.now
    },
    Rating: {
        type: Number,
        min: 1,
        max: 5
    },
    Review: {
        type: String
    },
    CancellationReason: {
        type: String
    },
    RefundStatus: {
        type: String,
        enum: ['requested', 'processed', 'not-applicable'],
        default: 'not-applicable'
    }
});

BookingSchema.pre('save', function (next) {
    this.UpdatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Booking', BookingSchema);
