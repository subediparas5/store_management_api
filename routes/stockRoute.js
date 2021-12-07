const router = require('express').Router();
const verify = require('./verifyToken');
const Products = require('../models/Products');


router.get('/', verify, async (request, response) => {
    if (request.query.id) {
        const id = request.query.id;

        Products.findById(id, { "_id": true, "name": true, "unit": true, "quantity": true, "stock": true })
            .then(product => {
                if (!product) {
                    response.status(404).send({ message: "Product not found" })
                }
                else {
                    response.send(product);
                }
            })
            .catch(err => {
                response.status(500).send({ message: "Some error occured" })
            })
    }
    else {
        Products.find(null, { "_id": true, "name": true, "unit": true, "quantity": true, "stock": true })
            .then(product => {
                response.send(product);
            })
            .catch(error => {
                response.status(400).send({ message: error.message || "Error occured while retriving products data" })
            })
    }
});

module.exports = router;