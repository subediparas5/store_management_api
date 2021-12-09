const Joi = require('@hapi/joi');

//Register Validation
const registerValidation = (data) => {
    const validationSchema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return validationSchema.validate(data);
};

const loginValidation = (data) => {
    const validationSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return validationSchema.validate(data);
};

const customerValidation = (data) => {
    const validationSchema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        credit: Joi.number().min(0).max(1000000),
        phone: Joi.number().min(9000000000).max(9999999999).required(),
        location: Joi.string().min(6).max(255).required(),
        pan_no: Joi.string().alphanum().min(6).max(255).required(),
    });
    return validationSchema.validate(data);
};

const productValidation = (data) => {
    const validationSchema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        selling_price: Joi.number().min(40).max(100000).required(),
        marketed_by: Joi.string().min(6).max(255).required(),
        unit: Joi.string().min(3).max(15).required(),
        quantity: Joi.string().min(3).max(15).required(),
        piece_in_box: Joi.number().min(1).max(255).required(),
        stock: Joi.number().min(0),
    });
    return validationSchema.validate(data);
};

const invoiceValidation = (data) => {
    const validationSchema = Joi.object({
        name: Joi.string().min(6).max(255),
        pan_no: Joi.string().alphanum().min(6).max(255).required(),
        bill_no: Joi.number().min(1),
        products: Joi.array().items(Joi.object({
            product_name: Joi.string().min(2).max(255).required(),
            product_unit: Joi.string().min(3).max(255).required(),
            product_piece_in_box: Joi.number().min(1).required(),
            unit_quantity: Joi.string().min(3).max(255).required(),
            product_price: Joi.number().min(40).max(100000),
            product_quantity: Joi.number().min(1).required(),
        })),
        discount: Joi.number().required(),
    });
    return validationSchema.validate(data);
}

const customerStatementsValidation = (data) => {
    const validationSchema = Joi.object({
        customer_name: Joi.string().min(6).max(255),
        paid_amount: Joi.number().max(1000000),
        payment_method: Joi.string().min(4).max(255).required(),
        customer_pan_no: Joi.string().alphanum().min(6).max(255).required(),
        payment_date: Joi.string().required().min(9)
    });
    return validationSchema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.customerValidation = customerValidation;
module.exports.productValidation = productValidation;
module.exports.invoiceValidation = invoiceValidation;
module.exports.customerStatementsValidation = customerStatementsValidation;
