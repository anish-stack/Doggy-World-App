const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    Quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    selectedPackId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,

    },
});

const CartSchema = new mongoose.Schema({
    PetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pet',
    },
    items: [CartItemSchema],
}, {
    timestamps: true,
});

// Create a Cart model
const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
