const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
    },
    selling_price: {
        type: Number,
        required: true,
        min: 40,
        max: 100000
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    marketed_by: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    unit: {
        type: String,
        default: "Box",
        minlength: 3,
        maxlength: 15,
    },
    quantity: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
    },
    piece_in_box: {
        type: Number,
        default:1,
        min: 1,
        max:255,
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    }
});

module.exports = mongoose.model('Products', productSchema);