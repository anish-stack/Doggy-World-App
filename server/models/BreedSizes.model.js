const mongoose = require('mongoose');

const ExtraThingSchema = new mongoose.Schema({
    BreedTitle: {
        type: String,
        trim: true
    },
    ItemForm: {
        type: String,
        trim: true
    },
    Flavours: {
        type: String,
        trim: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Extra', ExtraThingSchema);
