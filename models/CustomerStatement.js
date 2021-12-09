const mongoose = require('mongoose');

const customerStatementSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        minlength: 6,
        maxlength: 255,
    },
    customer_pan_no: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10,
    },
    payment_date: {
        type: String,
        minlength: 9
    },
    paid_amount: {
        type: Number,
    },
    payment_method: {
        type: String,
        minlength: 4
    }
});

module.exports = mongoose.model('CustomerStatements', customerStatementSchema);