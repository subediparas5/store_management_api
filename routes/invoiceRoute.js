const router = require('express').Router();
const verify = require('./verifyToken');
const { invoiceValidation } = require('../validation');
const Invoice = require('../models/Invoice');
const Customers = require('../models/Customers');
const Products = require('../models/Products');


router.post('/', verify, async (request, response) => {
    var customer_name;
    const { error } = invoiceValidation(request.body);
    if (error) return response.status(400).send(error.details[0].message);
    const billExist = await Invoice.findOne({ bill_no: request.body.bill_no });
    if (billExist) {
        return response.status(400).send('Invoice with same bill number already added');
    }
    const discount_percentage = request.body.discount;

    await Customers.findOne({ pan_number: request.body.pan_no })
        .then(customer => {
            if (!customer) {
                response.status(404).send({ message: "Customer with this pan number not found." })
            }
            else {
                customer_name = customer.name;
            }
        });
    let total_bills = 0;
    await Invoice.find()
        .then(invoice => {
            total_bills = invoice.length;
        });
    //Create new invoice
    const invoice = new Invoice({
        pan_no: request.body.pan_no,
        date: request.body.date,
        products: request.body.products.map(products => {
            return {
                product_name: products.product_name,
                product_unit: products.product_unit,
                unit_quantity: products.unit_quantity,
                product_piece_in_box: products.product_piece_in_box,
                product_price: products.product_price,
                product_quantity: products.product_quantity,
                //net_price: products.product_price * products.product_quantity,
            }
        }),
    });
    let total_selling_price = 0;
    let product_exists;
    for (let i = 0; i < invoice.products.length; i++) {
        //Find product's selling price

        await Products.findOne({ name: invoice.products[i].product_name, unit: invoice.products[i].product_unit, quantity: invoice.products[i].unit_quantity, piece_in_box: invoice.products[i].product_piece_in_box })
            .then(product => {
                if (!product) {
                    response.status(404).send({ message: `Product ${i} not found.` })
                }
                else {
                    invoice.products[i].product_price = product.selling_price;
                    invoice.products[i].net_price = invoice.products[i].product_price * invoice.products[i].product_quantity;
                }
            })
            .catch(error => {
                response.status(400).send({ message: error.message || "Error occured while retriving products data" })
            })

        total_selling_price = total_selling_price + invoice.products[i].net_price;

        for (let j = i + 1; j < invoice.products.length; j++) {
            const product_name_exists = invoice.products[i].product_name === invoice.products[j].product_name;
            const product_unit_exists = invoice.products[i].product_unit === invoice.products[j].product_unit;
            const unit_quantity_exists = invoice.products[i].unit_quantity === invoice.products[j].unit_quantity;
            product_exists = product_name_exists && product_unit_exists && unit_quantity_exists;
        }
    }
    if (product_exists) {
        return response.status(400).send('Duplicate products added. Please check and request again');
    }
    else {
        try {
            invoice.bill_no = total_bills + 1;
            invoice.name = customer_name;
            invoice.selling_price_without_vat = total_selling_price;
            invoice.discount = (discount_percentage * invoice.selling_price_without_vat) / 100;
            invoice.vat = (invoice.selling_price_without_vat - invoice.discount) * 0.13;
            invoice.selling_price_with_vat = (invoice.selling_price_without_vat - invoice.discount) + invoice.vat;
            const savedInvoice = await invoice.save();
            response.send({ bill_no: savedInvoice.bill_no });
        } catch (err) {
            response.status(400).send(err);
        }
    }
});

router.get('/', verify, async (request, response) => {
    if (request.query.id) {
        const id = request.query.id;

        Invoice.findById(id)
            .then(invoice => {
                if (!invoice) {
                    response.status(404).send({ message: "Invoice not found" });
                }
                else {
                    response.send(invoice);
                }
            })
            .catch(err => {
                response.status(500).send({ message: "Some error occured" })
            })
    }
    else if (request.query.pan_no) {
        const pan = request.query.pan_no;

        Invoice.find({ pan_no: pan })
            .then(invoice => {
                if (!invoice) {
                    response.status(404).send({ message: "Invoice not found" });
                }
                else {
                    response.send(invoice);
                }
            })
            .catch(err => {
                response.status(500).send({ message: "Some error occured" })
            })
    }
    else {
        Invoice.find()
            .then(invoice => {
                response.send(invoice);
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