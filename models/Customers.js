const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    credit: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 1000000,
    },
    phone: {
        type: Number,
        default: 012,
        required: true,
        minlength: 9,
        maxlength: 10,
    },
    location: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    pan_no: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10,
    }
});

module.exports = mongoose.model('Customers', customerSchema);