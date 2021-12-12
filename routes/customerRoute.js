const router = require('express').Router();
const verify = require('./verifyToken');
const { customerValidation } = require('../validation');
const Customers = require('../models/Customers');


router.post('/', verify, async (request, response) => {
    // validating data
    const { error } = customerValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);
    //check if customer is already registered with same pan number
    const panNumExist = await Customers.findOne({ pan_no: request.body.pan_no });
    if (panNumExist) {
        return response.status(400).send('Customer with same PAN already added.');
    }

    //Create new Customer
    const customer = new Customers({
        name: request.body.name,
        credit: request.body.credit,
        phone: request.body.phone,
        location: request.body.location,
        pan_no: request.body.pan_no,
    });
    try {
        const savedCustomer = await customer.save();
        response.send({ customer: savedCustomer._id });
    } catch (err) {
        response.status(400).send(err);
    }
});

router.get('/', verify, async (request, response) => {

    if (request.query.id) {
        const id = request.query.id;

        Customers.findById(id)
            .then(data => {
                if (!data) {
                    response.status(404).send({ message: "User not found" })
                }
                else {
                    response.send(data);
                }
            })
            .catch(err => {
                response.status(500).send({ message: "Some error occured" })
            })
    }
    else if (request.query.name) {
        const name = request.query.name;
        Customers.find({ name: name })
            .then(data => {
                if (!data) {
                    response.status(404).send({ message: "Customer with that name not found" })
                }
                else {
                    response.send(data);
                }
            })
            .catch(err => {
                response.status(500).send({ message: "Some error occured" })
            })
    }
    else {
        Customers.find()
            .then(customer => {
                response.send(customer)
            })
            .catch(error => {
                response.status(400).send({ message: error.message || "Error occured while retriving products data" })
            })
    }
});

router.put('/:id', verify, async (request, response) => {
    if (!request.body) {
        return response.status(400).send({ message: "Data to update cannot be empty" })
    }

    const id = request.params.id;
    const panNumExist = await Customers.findOne({ pan_no: request.body.pan_no });
    if (panNumExist) {
        return response.status(400).send('Customer with same PAN already added.');
    }
    Customers.findByIdAndUpdate(id, request.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                response.status(404).send({ message: `Cannot update user with id: ${id}. User may not be found` })
            }
            else {
                response.send(data)
            }
        })
        .catch(err => {
            response.status(500).send({ message: "Error updating user information" })
        })
})

module.exports = router;