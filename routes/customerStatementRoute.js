const router = require('express').Router();
const CustomerStatements = require('../models/CustomerStatement');
const { customerStatementsValidation } = require('../validation');
const verify = require('./verifyToken');
const Customers = require('../models/Customers');

router.post('/', verify, async (request, response) => {
    // validating data
    const { error } = customerStatementsValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);
    //find customer name using pan number
    var customer_name;
    await Customers.findOne({ pan_number: request.body.customer_pan_no })
        .then(customer => {
            if (!customer) {
                response.status(404).send({ message: "Customer with this pan number not found." })
            }
            else {
                customer_name = customer.name;
            }
        });

    //Create new payment statement
    const customer_statements = new CustomerStatements({
        customer_pan_no: request.body.customer_pan_no,
        payment_date: request.body.payment_date,
        paid_amount: request.body.paid_amount,
        payment_method: request.body.payment_method,
    });
    try {
        customer_statements.customer_name = customer_name;
        const saved_customer_statements = await customer_statements.save();
        response.send({ customer_statement: saved_customer_statements._id });
    } catch (err) {
        response.status(400).send(err);
    }
});

module.exports = router;