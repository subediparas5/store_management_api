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
    var total_credit;
    var customer_id;
    await Customers.findOne({ pan_number: request.body.customer_pan_no })
        .then(customer => {
            if (!customer) {
                response.status(404).send({ message: "Customer with this pan number not found." })
            }
            else {
                customer_name = customer.name;
                total_credit = customer.credit;
                customer_id = customer.id;
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
        total_credit -= saved_customer_statements.paid_amount;
        // console.log(`${customer_id} + ${total_credit}`);
        await Customers.findOneAndUpdate({ pan_number: request.body.customer_pan_no }, { credit: total_credit }, { useFindAndModify: false })
            .then(data => {
                console.log("Customer credit update successfull");
            })
        response.send({ customer_statement: saved_customer_statements._id });
    } catch (err) {
        response.status(400).send(err);
    }
});

router.get('/', verify, async (request, response) => {
    if (request.query.id) {
        const id = request.query.id;

        CustomerStatements.findById(id)
            .then(customerStatements => {
                if (!customerStatements) {
                    response.status(404).send({ message: "Invoice not found" });
                }
                else {
                    response.send(customerStatements);
                }
            })
            .catch(err => {
                response.status(500).send({ message: "Some error occured" })
            })
    }
    else if (request.query.customer_pan_no) {
        const customer_pan_no = request.query.customer_pan_no;

        CustomerStatements.find({ customer_pan_no: customer_pan_no })
            .then(customerStatements => {
                if (!customerStatements) {
                    response.status(404).send({ message: "Invoice not found" });
                }
                else {
                    response.send(customerStatements);
                }
            })
            .catch(err => {
                response.status(500).send({ message: "Some error occured" })
            })
    }
    else {
        CustomerStatements.find()
            .then(customerStatements => {
                response.send(customerStatements);
            })
            .catch(error => {
                response.status(400).send({ message: error.message || "Error occured while retriving products data" })
            })
    }

});
module.exports = router;