const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Enter  a title'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Enter a description']
    },
    image: {
        type: String,
    },
    user: {
        type: String
    }
}, { timestamps: true })

const Listing = mongoose.model('Listing', listingSchema);


module.exports = Listing;