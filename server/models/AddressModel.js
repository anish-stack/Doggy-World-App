const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    streetAddress: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    landmark: {
        type: String,
        trim: true,
    },
    pincode: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{6}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid pincode!`,
        },
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    PetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
    },
    AddressType:{
        type: String,
    },
    UpdateAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

addressSchema.pre('save', function (next) {
    this.UpdateAt = Date.now();
    next();
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
