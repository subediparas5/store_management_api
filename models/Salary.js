const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    staff_name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    staff_phone: {
        type: Number,
        required: true,
        min: 99999999,
        maxlength: 9999999999,
    },
    paid_amount: {
        type: Number,
        required: true,
    },
    cheque_no: {
        type: String,
        minlength: 2
    },
    month: {
        type: Date,
        default: Date.now,
    },
    remarks: {
        type: String,
        minlength: 5,
        maxlength:255
    }
});

module.exports = mongoose.model('Salary', salarySchema);