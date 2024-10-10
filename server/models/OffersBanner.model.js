const mongoose = require('mongoose')

const OfferBannerSchema = new mongoose.Schema({
    Image: [{
        url: {
            type: String
        },
        PublicId: {
            type: String

        }
    }],
    RedirectAt: {
        type: String
    },
    active: { type: Boolean, default: true }
})

module.exports = mongoose.model('Offer-Banner', OfferBannerSchema);
