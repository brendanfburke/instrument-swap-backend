const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, 'link _id'],
        unique: true
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    primary_instrument: {
        type: String
    },
    gear_interests: [{type: String}],
    wish_list: [{type: String}],
    location: {
        type: String
    },
    email_address: {
        type: String,
        unique: [true, 'Email must not already be registered'],
        required: true
    }
}, { timestamps: true })

const Account = mongoose.model('Account', accountSchema);


module.exports = Account;