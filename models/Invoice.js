const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    pan_no: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10,
    },
    name: {
        type: String,
        minlength: 6,
        maxlength: 255,
    },
    date: {
        type: String,
        default: '2078/79',
        minlength: 7,
        maxlength: 7,
    },
    bill_no: {
        type: Number,
        min: 1,
    },
    products: [
        {
            product_name: {
                type: String,
                required: true,
                minlength: 6,
                maxlength: 255,
            },
            product_unit: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 255,
            },
            product_piece_in_box: {
                type: Number,
                required: true,
                min: 1,
            },
            unit_quantity: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 15,
            },
            product_price: {
                type: Number,
                min: 40,
            },
            product_quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            net_price: {
                type: Number,
                min: 40,
            },
        }
    ],
    selling_price: {
        type: Number,
        min: 40,
    },
    discount: {
        type: Number,
        required: true,
    },
    selling_price_without_vat: {
        type: Number,
        min: 40,
    },
    vat: {
        type: Number,
        min: 1,
    },
    selling_price_with_vat: {
        type: Number,
        min: 40,
    }

});

module.exports = mongoose.model('Invoice', invoiceSchema);