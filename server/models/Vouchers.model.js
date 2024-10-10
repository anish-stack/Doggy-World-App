const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
    CouponCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    HowMuchPercentageOf: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    Active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index to ensure unique coupon codes
VoucherSchema.index({ CouponCode: 1 }, { unique: true });

// Method to apply voucher
VoucherSchema.methods.applyVoucher = function(orderTotal) {
    if (!this.Active) {
        throw new Error('Voucher is not active');
    }
    const discountAmount = (orderTotal * this.HowMuchPercentageOf) / 100;
    return orderTotal - discountAmount;
};

const Voucher = mongoose.model('Voucher', VoucherSchema);

module.exports = Voucher;