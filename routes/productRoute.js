const router = require('express').Router();
const verify = require('./verifyToken');
const { productValidation } = require('../validation');
const Products = require('../models/Products');


router.post('/', verify, async (request, response) => {
    // validating data
    const { error } = productValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);
    //check if product is already registered with same name as well as unit
    const productExist = await Products.findOne({ name: request.body.name, unit: request.body.unit, quantity: request.body.quantity, piece_in_box: request.body.piece_in_box });
    if (productExist) {
        return response.status(400).send('Product with same name, unit, pieces in box and quantity already added');
    }

    //Create new Product
    const product = new Products({
        name: request.body.name,
        selling_price: request.body.selling_price,
        updatedDate: request.body.updatedDate,
        marketed_by: request.body.marketed_by,
        unit: request.body.unit,
        quantity: request.body.quantity,
        piece_in_box: request.body.piece_in_box,
        stock: request.body.stock,
    });
    try {
        const savedProduct = await product.save();
        response.send({ product: savedProduct._id });
    } catch (err) {
        response.status(400).send(err);
    }
});

router.get('/', verify, async (request, response) => {
    if (request.query.id) {
        const id = request.query.id;

        Products.findById(id)
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
        Products.find()
            .then(product => {
                response.send(product)
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
    const productExist = await Products.findOne({ name: request.body.name, unit: request.body.unit, quantity: request.body.quantity });
    if (productExist) {
        return response.status(400).send('Product with same name, unit and quantity already added');
    }
    Products.findByIdAndUpdate(id, request.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                response.status(404).send({ message: `Cannot update product with id: ${id}. Product may not be found.` })
            }
            else {
                response.send(data)
            }
        })
        .catch(err => {
            response.status(500).send({ message: "Error updating product information" })
        })
})

module.exports = router;