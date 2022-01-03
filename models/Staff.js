const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    phone: {
        type: Number,
        required: true,
        min: 99999999,
        max: 9999999999,
    },
    sec_phone: {
        type: Number,
        min: 99999999,
        max: 9999999999,
    },
    home_phone: {
        type: Number,
        min: 99999999,
        max: 9999999999,
    },
    address: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: true
    },
    citizenship: {
        type: String,
        minlength: 4,
        maxlength: 25,
        required: true
    },
    license: {
        type: String,
        minlength: 4,
        maxlength: 25,
    }

});

module.exports = mongoose.model('Staff', staffSchema);